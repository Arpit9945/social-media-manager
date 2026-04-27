'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ToolHeader from '@/components/Shared/ToolHeader';
import TemplatePicker from './TemplatePicker';
import ReelPreview from './ReelPreview';
import ReelExporter from './ReelExporter';
import { TEMPLATES, getDefaultData } from './templates';
import styles from './ReelGenerator.module.scss';

export default function ReelGenerator({ user, profile }) {
  const [step, setStep] = useState('template'); // 'template' | 'editor' | 'export'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState(null);

  const handlePickTemplate = (template) => {
    setSelectedTemplate(template);
    setFormData(getDefaultData(template, profile));
    setStep('editor');
  };

  const handleBack = () => {
    if (step === 'editor') {
      setStep('template');
      setSelectedTemplate(null);
    } else if (step === 'export') {
      setStep('editor');
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.page}>
      <ToolHeader
        user={user}
        profile={profile}
        breadcrumb={[
          { label: 'Generator', href: '/dashboard' },
          { label: 'Reel Generator' },
        ]}
      />

      <main className={styles.main}>
        {step === 'template' && (
          <div className={styles.templateView}>
            <div className={styles.titleBlock}>
              <span className={styles.eyebrow}>REEL GENERATOR</span>
              <h1 className={styles.title}>
                Create animated reels in <span className={styles.gradient}>under a minute</span>
              </h1>
              <p className={styles.subtitle}>
                Pick a template, type your message, download as video or GIF. No video editing skills needed.
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
              {/* Form */}
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
                    <p className={styles.helpText}>{formData.title.length}/100 characters</p>
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
                      placeholder="Save • Share • Link in bio"
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

                  <button
                    onClick={() => setStep('export')}
                    className={styles.exportBtn}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v8M5 7l3 3 3-3M2 13h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Export reel
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className={styles.previewCol}>
                <div className={styles.previewSticky}>
                  <ReelPreview template={selectedTemplate} data={formData} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'export' && selectedTemplate && formData && (
          <ReelExporter
            template={selectedTemplate}
            data={formData}
            user={user}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}
