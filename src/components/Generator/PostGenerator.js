'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import ToolHeader from '@/components/Shared/ToolHeader';
import TemplatePicker from './TemplatePicker';
import { TEMPLATES, getDefaultData } from './templates';
import { REEL_WIDTH, REEL_HEIGHT } from '@/lib/reel/canvasEngine';
import styles from './PostGenerator.module.scss';

const FORMATS = [
  { id: 'png', name: 'PNG', desc: 'Best quality, larger file', mime: 'image/png', quality: 0.95 },
  { id: 'jpg', name: 'JPG', desc: 'Smaller file, fine for social', mime: 'image/jpeg', quality: 0.9 },
  { id: 'webp', name: 'WebP', desc: 'Modern format, best compression', mime: 'image/webp', quality: 0.9 },
];

export default function PostGenerator({ user, profile }) {
  const [step, setStep] = useState('template'); // 'template' | 'editor'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState(null);
  const [exportFormat, setExportFormat] = useState('png');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const previewRef = useRef(null);
  const exportRef = useRef(null);

  const handlePickTemplate = (template) => {
    setSelectedTemplate(template);
    setFormData(getDefaultData(template, profile));
    setStep('editor');
  };

  const handleBack = () => {
    setStep('template');
    setSelectedTemplate(null);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Render preview as data changes
  useEffect(() => {
    if (step !== 'editor' || !selectedTemplate || !formData || !previewRef.current) return;

    const canvas = previewRef.current;
    const ctx = canvas.getContext('2d');
    
    if (selectedTemplate.renderStatic) {
      selectedTemplate.renderStatic(ctx, formData);
    } else {
      // Default to 80% progress
      selectedTemplate.render(ctx, 360, 450, 0.8, formData);
    }
  }, [selectedTemplate, formData, step]);

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleExport = async () => {
    setError('');
    setIsExporting(true);

    try {
      // Use a fresh canvas for export at full size
      const canvas = exportRef.current;
      if (!canvas) throw new Error('Export canvas not ready');

      const ctx = canvas.getContext('2d');
      
      // Render at 80% progress for "fully revealed" state
      if (selectedTemplate.renderStatic) {
        selectedTemplate.renderStatic(ctx, formData);
      } else {
        selectedTemplate.render(ctx, 360, 450, 0.8, formData);
      }

      const format = FORMATS.find((f) => f.id === exportFormat);
      
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, format.mime, format.quality);
      });

      if (!blob) throw new Error('Export failed');

      const safeTitle = (formData.title || 'post').replace(/[^a-z0-9]/gi, '-').substring(0, 30).toLowerCase();
      const filename = `asma-post-${safeTitle}-${Date.now()}.${exportFormat}`;
      downloadBlob(blob, filename);

      // Save to library (non-blocking)
      try {
        const supabase = createClient();
        const filePath = `${user.id}/${filename}`;
        await supabase.storage
          .from('generated-posts')
          .upload(filePath, blob, { contentType: format.mime, cacheControl: '3600' });

        const { data: urlData } = supabase.storage
          .from('generated-posts')
          .getPublicUrl(filePath);

        await supabase.from('generated_posts').insert({
          user_id: user.id,
          post_type: 'static',
          content_format: 'static',
          template_id: selectedTemplate.id,
          title: formData.title,
          caption: formData.subtitle,
          template_data: formData,
          file_format: exportFormat,
          image_url: urlData?.publicUrl || null,
        });
      } catch (saveErr) {
        console.warn('Save to library failed:', saveErr);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Export failed. Try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.page}>
      <ToolHeader
        user={user}
        profile={profile}
        breadcrumb={[
          { label: 'Generator', href: '/dashboard' },
          { label: 'Post Generator' },
        ]}
      />

      <main className={styles.main}>
        {step === 'template' && (
          <div className={styles.templateView}>
            <div className={styles.titleBlock}>
              <span className={styles.eyebrow}>POST GENERATOR</span>
              <h1 className={styles.title}>
                Static posts in <span className={styles.gradient}>seconds</span>
              </h1>
              <p className={styles.subtitle}>
                Same beautiful templates, no animation. Pick, customize, download. Done.
              </p>
            </div>

            <TemplatePicker
              templates={TEMPLATES}
              brandProfile={profile}
              onPick={handlePickTemplate}
            />
          </div>
        )}

        {step === 'editor' && selectedTemplate && formData && (
          <div className={styles.editorView}>
            <button onClick={handleBack} className={styles.backBtn}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Pick different template
            </button>

            <div className={styles.editorGrid}>
              <div className={styles.formCol}>
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>{selectedTemplate.name}</h2>
                  <p className={styles.formDesc}>{selectedTemplate.description}</p>
                </div>

                <div className={styles.form}>
                  <div className={styles.field}>
                    <label className={styles.label}>Title / Hook</label>
                    <textarea
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Your main message"
                      className={styles.textarea}
                      rows={2}
                      maxLength={100}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>
                      Subtitle {selectedTemplate.id === 'tutorial' && <span className={styles.optional}>(3 lines, separated by Enter)</span>}
                    </label>
                    <textarea
                      value={formData.subtitle}
                      onChange={(e) => updateField('subtitle', e.target.value)}
                      placeholder={selectedTemplate.id === 'tutorial' ? 'Step 1\nStep 2\nStep 3' : 'Supporting text'}
                      className={styles.textarea}
                      rows={selectedTemplate.id === 'tutorial' ? 4 : 2}
                      maxLength={200}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Call to action</label>
                    <input
                      type="text"
                      value={formData.cta}
                      onChange={(e) => updateField('cta', e.target.value)}
                      placeholder="Save • Share"
                      className={styles.input}
                      maxLength={60}
                    />
                  </div>

                  <details className={styles.advancedToggle}>
                    <summary className={styles.advancedSummary}>
                      <span>Customize colors</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.toggleIcon}>
                        <path d="M5 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>

                    <div className={styles.colorsGrid}>
                      <div className={styles.colorField}>
                        <label className={styles.colorLabel}>Primary</label>
                        <div className={styles.colorPickerRow}>
                          <input
                            type="color"
                            value={formData.primaryColor}
                            onChange={(e) => updateField('primaryColor', e.target.value)}
                            className={styles.colorPicker}
                          />
                          <input
                            type="text"
                            value={formData.primaryColor}
                            onChange={(e) => updateField('primaryColor', e.target.value)}
                            className={styles.colorText}
                            maxLength={7}
                          />
                        </div>
                      </div>
                      <div className={styles.colorField}>
                        <label className={styles.colorLabel}>Secondary</label>
                        <div className={styles.colorPickerRow}>
                          <input
                            type="color"
                            value={formData.secondaryColor}
                            onChange={(e) => updateField('secondaryColor', e.target.value)}
                            className={styles.colorPicker}
                          />
                          <input
                            type="text"
                            value={formData.secondaryColor}
                            onChange={(e) => updateField('secondaryColor', e.target.value)}
                            className={styles.colorText}
                            maxLength={7}
                          />
                        </div>
                      </div>
                    </div>
                  </details>

                  <div className={styles.field}>
                    <label className={styles.label}>Export format</label>
                    <div className={styles.formatPicker}>
                      {FORMATS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setExportFormat(f.id)}
                          className={`${styles.formatTab} ${exportFormat === f.id ? styles.formatActive : ''}`}
                        >
                          <span className={styles.formatTabName}>{f.name}</span>
                          <span className={styles.formatTabDesc}>{f.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className={styles.error} role="alert">{error}</div>
                  )}

                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={styles.downloadBtn}
                  >
                    {isExporting ? (
                      <>
                        <span className={styles.spinner}></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 2v8M5 7l3 3 3-3M2 13h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download as {exportFormat.toUpperCase()}
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.previewCol}>
                <div className={styles.previewSticky}>
                  <div className={styles.phoneFrame}>
                    <div className={styles.canvasWrapper}>
                      <canvas
                        ref={previewRef}
                        width={REEL_WIDTH}
                        height={REEL_HEIGHT}
                        className={styles.canvas}
                      />
                    </div>
                  </div>
                  <p className={styles.previewMeta}>1080×1920 • Static post</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden export canvas */}
        <canvas
          ref={exportRef}
          width={REEL_WIDTH}
          height={REEL_HEIGHT}
          style={{ display: 'none' }}
        />
      </main>
    </div>
  );
}
