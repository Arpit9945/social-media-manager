'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo/Logo';
import styles from './Settings.module.scss';

// Convert any image to WebP using browser canvas
async function convertToWebP(file, quality = 0.9, maxDimension = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('WebP conversion failed')),
        'image/webp',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };
    img.src = url;
  });
}

const PRESETS = [
  { name: 'Violet Pink', primary: '#8b5cf6', secondary: '#ec4899' },
  { name: 'Ocean Blue', primary: '#3b82f6', secondary: '#06b6d4' },
  { name: 'Forest Green', primary: '#10b981', secondary: '#14b8a6' },
  { name: 'Sunset', primary: '#f59e0b', secondary: '#ef4444' },
  { name: 'Royal Purple', primary: '#7c3aed', secondary: '#a855f7' },
  { name: 'Midnight', primary: '#1e293b', secondary: '#475569' },
  { name: 'Rose Gold', primary: '#f43f5e', secondary: '#fb923c' },
  { name: 'Mono Black', primary: '#171717', secondary: '#525252' },
];

const CATEGORIES = [
  { id: 'fashion', label: 'Fashion & Apparel' },
  { id: 'beauty', label: 'Beauty & Skincare' },
  { id: 'food', label: 'Food & Beverage' },
  { id: 'fitness', label: 'Fitness & Wellness' },
  { id: 'tech', label: 'Tech & Gadgets' },
  { id: 'education', label: 'Education & Coaching' },
  { id: 'travel', label: 'Travel & Hospitality' },
  { id: 'home', label: 'Home & Decor' },
  { id: 'finance', label: 'Finance & Business' },
  { id: 'creator', label: 'Personal Brand / Creator' },
  { id: 'service', label: 'Local Services' },
  { id: 'other', label: 'Other' },
];

const TONES = [
  { id: 'casual', label: 'Casual & Friendly' },
  { id: 'professional', label: 'Professional & Polished' },
  { id: 'luxury', label: 'Luxury & Premium' },
  { id: 'playful', label: 'Playful & Fun' },
  { id: 'inspiring', label: 'Inspiring & Bold' },
];

const TABS = [
  { id: 'identity', label: 'Brand Identity' },
  { id: 'design', label: 'Colors' },
  { id: 'audience', label: 'Audience' },
  { id: 'voice', label: 'Voice' },
  { id: 'account', label: 'Account' },
];

export default function SettingsClient({ user, profile }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('identity');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [data, setData] = useState({
    brand_name: profile?.brand_name || '',
    logo_url: profile?.logo_url || '',
    brand_description: profile?.brand_description || '',
    primary_color: profile?.primary_color || '#8b5cf6',
    secondary_color: profile?.secondary_color || '#ec4899',
    product_category: profile?.product_category || '',
    target_age_min: profile?.target_age_min || 18,
    target_age_max: profile?.target_age_max || 35,
    target_gender: profile?.target_gender || 'all',
    target_location: profile?.target_location || 'India',
    brand_tone: profile?.brand_tone || '',
    instagram_handle: profile?.instagram_handle || '',
  });

  const update = (updates) => {
    setData((prev) => ({ ...prev, ...updates }));
    setSaveSuccess(false);
    setError('');
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Sirf image files allowed hain');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image 5MB se chhoti honi chahiye');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Convert to WebP first (smaller size, better quality)
      const webpBlob = await convertToWebP(file, 0.9, 800);

      const supabase = createClient();
      const fileName = `${user.id}/logo-${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, webpBlob, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (uploadError) {
        if (uploadError.message?.includes('row-level security') || uploadError.message?.includes('policy')) {
          setError('Storage permission missing. Logos bucket ki RLS policy set karo.');
        } else {
          setError(`Upload failed: ${uploadError.message}`);
        }
        return;
      }

      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(fileName);
      update({ logo_url: urlData.publicUrl });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Logo upload nahi ho saka.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const supabase = createClient();

      const { error: dbError } = await supabase
        .from('brand_profiles')
        .update({
          brand_name: data.brand_name.trim(),
          logo_url: data.logo_url || null,
          brand_description: data.brand_description.trim() || null,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          product_category: data.product_category,
          target_age_min: data.target_age_min,
          target_age_max: data.target_age_max,
          target_gender: data.target_gender,
          target_location: data.target_location,
          brand_tone: data.brand_tone,
          instagram_handle: data.instagram_handle.trim() || null,
        })
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Save karne mein problem aayi.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/dashboard" className={styles.logoLink}>
            <Logo size={28} textSize="md" />
          </Link>
          <Link href="/dashboard" className={styles.backLink}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dashboard
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage your brand profile and account</p>
        </div>

        <div className={styles.layout}>
          {/* Sidebar tabs */}
          <aside className={styles.sidebar}>
            <nav className={styles.tabs}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <section className={styles.content}>
            {activeTab === 'identity' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Brand Identity</h2>

                <div className={styles.field}>
                  <label className={styles.label}>Brand name</label>
                  <input
                    type="text"
                    value={data.brand_name}
                    onChange={(e) => update({ brand_name: e.target.value })}
                    className={styles.input}
                    maxLength={60}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Logo</label>
                  {data.logo_url ? (
                    <div className={styles.logoPreview}>
                      <img src={data.logo_url} alt="Logo" className={styles.logoImage} />
                      <button
                        onClick={() => update({ logo_url: '' })}
                        className={styles.removeBtn}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className={styles.uploadBox}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                        className={styles.fileInput}
                      />
                      {uploading ? 'Uploading...' : 'Click to upload (PNG/JPG, max 2MB)'}
                    </label>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Brand description</label>
                  <textarea
                    value={data.brand_description}
                    onChange={(e) => update({ brand_description: e.target.value })}
                    className={styles.textarea}
                    rows={3}
                    maxLength={200}
                    placeholder="One line about what your brand does"
                  />
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Brand Colors</h2>

                <div
                  className={styles.colorPreview}
                  style={{
                    background: `linear-gradient(135deg, ${data.primary_color}, ${data.secondary_color})`,
                  }}
                >
                  <span>{data.brand_name || 'Your Brand'}</span>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Quick presets</label>
                  <div className={styles.presetGrid}>
                    {PRESETS.map((preset) => {
                      const isSelected =
                        data.primary_color === preset.primary &&
                        data.secondary_color === preset.secondary;
                      return (
                        <button
                          key={preset.name}
                          onClick={() =>
                            update({
                              primary_color: preset.primary,
                              secondary_color: preset.secondary,
                            })
                          }
                          className={`${styles.presetBtn} ${isSelected ? styles.presetSelected : ''}`}
                        >
                          <div
                            className={styles.presetSwatch}
                            style={{
                              background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                            }}
                          ></div>
                          <span>{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.colorRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Primary</label>
                    <div className={styles.colorInputWrapper}>
                      <input
                        type="color"
                        value={data.primary_color}
                        onChange={(e) => update({ primary_color: e.target.value })}
                        className={styles.colorInput}
                      />
                      <input
                        type="text"
                        value={data.primary_color}
                        onChange={(e) => update({ primary_color: e.target.value })}
                        className={styles.colorHex}
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Secondary</label>
                    <div className={styles.colorInputWrapper}>
                      <input
                        type="color"
                        value={data.secondary_color}
                        onChange={(e) => update({ secondary_color: e.target.value })}
                        className={styles.colorInput}
                      />
                      <input
                        type="text"
                        value={data.secondary_color}
                        onChange={(e) => update({ secondary_color: e.target.value })}
                        className={styles.colorHex}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audience' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Target Audience</h2>

                <div className={styles.field}>
                  <label className={styles.label}>Category</label>
                  <select
                    value={data.product_category}
                    onChange={(e) => update({ product_category: e.target.value })}
                    className={styles.select}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Age range: {data.target_age_min}–{data.target_age_max}
                  </label>
                  <div className={styles.sliderRow}>
                    <span className={styles.sliderLabel}>Min</span>
                    <input
                      type="range"
                      min="13"
                      max="65"
                      value={data.target_age_min}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val < data.target_age_max) update({ target_age_min: val });
                      }}
                      className={styles.slider}
                    />
                  </div>
                  <div className={styles.sliderRow}>
                    <span className={styles.sliderLabel}>Max</span>
                    <input
                      type="range"
                      min="13"
                      max="65"
                      value={data.target_age_max}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val > data.target_age_min) update({ target_age_max: val });
                      }}
                      className={styles.slider}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Primary audience</label>
                  <div className={styles.optionRow}>
                    {[
                      { id: 'all', label: 'Everyone' },
                      { id: 'female', label: 'Mostly women' },
                      { id: 'male', label: 'Mostly men' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => update({ target_gender: g.id })}
                        className={`${styles.optionBtn} ${
                          data.target_gender === g.id ? styles.optionSelected : ''
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Location focus</label>
                  <select
                    value={data.target_location}
                    onChange={(e) => update({ target_location: e.target.value })}
                    className={styles.select}
                  >
                    <option value="India">India</option>
                    <option value="India + Global">India + Global</option>
                    <option value="Global">Global</option>
                    <option value="Specific city">Specific city</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Brand Voice</h2>

                <div className={styles.field}>
                  <label className={styles.label}>Tone</label>
                  <div className={styles.toneList}>
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => update({ brand_tone: t.id })}
                        className={`${styles.toneBtn} ${
                          data.brand_tone === t.id ? styles.toneSelected : ''
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Instagram handle</label>
                  <div className={styles.handleInput}>
                    <span className={styles.handlePrefix}>@</span>
                    <input
                      type="text"
                      value={data.instagram_handle}
                      onChange={(e) =>
                        update({
                          instagram_handle: e.target.value
                            .replace(/^@/, '')
                            .replace(/[^a-zA-Z0-9._]/g, ''),
                        })
                      }
                      placeholder="yourbrand"
                      className={styles.input}
                      maxLength={30}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Account</h2>

                <div className={styles.accountInfo}>
                  <div className={styles.accountRow}>
                    <span className={styles.accountLabel}>Email</span>
                    <span className={styles.accountValue}>{user.email}</span>
                  </div>
                  <div className={styles.accountRow}>
                    <span className={styles.accountLabel}>Signed in via</span>
                    <span className={styles.accountValue}>Google</span>
                  </div>
                  <div className={styles.accountRow}>
                    <span className={styles.accountLabel}>Account created</span>
                    <span className={styles.accountValue}>
                      {new Date(user.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className={styles.dangerZone}>
                  <h3 className={styles.dangerTitle}>Sign out</h3>
                  <p className={styles.dangerText}>
                    Sign out of your account on this device.
                  </p>
                  <button onClick={handleSignOut} className={styles.signOutBtn}>
                    Sign out
                  </button>
                </div>
              </div>
            )}

            {/* Save bar - shown for editable tabs */}
            {activeTab !== 'account' && (
              <div className={styles.saveBar}>
                {error && <span className={styles.errorMsg}>{error}</span>}
                {saveSuccess && (
                  <span className={styles.successMsg}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Saved successfully
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={styles.saveBtn}
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
