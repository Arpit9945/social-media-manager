'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo/Logo';
import StepWelcome from './steps/StepWelcome';
import StepIdentity from './steps/StepIdentity';
import StepColors from './steps/StepColors';
import StepAudience from './steps/StepAudience';
import StepVoice from './steps/StepVoice';
import styles from './Onboarding.module.scss';

const TOTAL_STEPS = 5;

export default function OnboardingClient({ user, existingProfile }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    brand_name: existingProfile?.brand_name || '',
    logo_url: existingProfile?.logo_url || '',
    brand_description: existingProfile?.brand_description || '',
    primary_color: existingProfile?.primary_color || '#8b5cf6',
    secondary_color: existingProfile?.secondary_color || '#ec4899',
    product_category: existingProfile?.product_category || '',
    target_age_min: existingProfile?.target_age_min || 18,
    target_age_max: existingProfile?.target_age_max || 35,
    target_gender: existingProfile?.target_gender || 'all',
    target_location: existingProfile?.target_location || 'India',
    brand_tone: existingProfile?.brand_tone || '',
    instagram_handle: existingProfile?.instagram_handle || '',
  });

  const updateData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setError('');
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const validateStep = (step) => {
    if (step === 2) {
      if (!formData.brand_name.trim()) {
        setError('Brand name daalna zaruri hai');
        return false;
      }
    }
    if (step === 4) {
      if (!formData.product_category) {
        setError('Product category select karo');
        return false;
      }
      if (!formData.target_gender) {
        setError('Target audience select karo');
        return false;
      }
    }
    if (step === 5) {
      if (!formData.brand_tone) {
        setError('Brand voice select karo');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setSaving(true);
      setError('');

      const supabase = createClient();

      const profileData = {
        user_id: user.id,
        brand_name: formData.brand_name.trim(),
        logo_url: formData.logo_url || null,
        brand_description: formData.brand_description.trim() || null,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        product_category: formData.product_category,
        target_age_min: formData.target_age_min,
        target_age_max: formData.target_age_max,
        target_gender: formData.target_gender,
        target_location: formData.target_location,
        brand_tone: formData.brand_tone,
        instagram_handle: formData.instagram_handle.trim() || null,
        is_onboarded: true,
      };

      const { error: dbError } = existingProfile
        ? await supabase.from('brand_profiles').update(profileData).eq('user_id', user.id)
        : await supabase.from('brand_profiles').insert(profileData);

      if (dbError) throw dbError;

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Onboarding error:', err);
      setError('Save karne mein problem aayi. Phir se try karo.');
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepWelcome onNext={nextStep} userName={user?.user_metadata?.full_name?.split(' ')[0] || 'Creator'} />;
      case 2:
        return <StepIdentity data={formData} updateData={updateData} userId={user.id} />;
      case 3:
        return <StepColors data={formData} updateData={updateData} />;
      case 4:
        return <StepAudience data={formData} updateData={updateData} />;
      case 5:
        return <StepVoice data={formData} updateData={updateData} />;
      default:
        return null;
    }
  };

  const progressPercent = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} aria-hidden="true"></div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoLink}>
            <Logo size={28} textSize="md" />
          </div>
          <span className={styles.stepCounter}>
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.stepContainer}>
          {renderStep()}

          {error && (
            <div className={styles.error} role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v3m0 2v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {currentStep > 1 && (
            <div className={styles.navButtons}>
              <button onClick={prevStep} className={styles.backButton} disabled={saving}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>

              {currentStep < TOTAL_STEPS ? (
                <button onClick={handleNext} className={styles.nextButton}>
                  Continue
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <button onClick={handleSubmit} className={styles.submitButton} disabled={saving}>
                  {saving ? (
                    <>
                      <span className={styles.spinner}></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete setup
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
