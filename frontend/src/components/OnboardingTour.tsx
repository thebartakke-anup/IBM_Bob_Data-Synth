import React, { useState, useEffect } from 'react';

interface OnboardingTourProps {
  run?: boolean;
  onComplete?: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = () => {
  // Temporarily disabled due to react-joyride compatibility issues
  // Will be re-enabled once the library is updated
  return null;
};

export default OnboardingTour;

// Hook to check if user should see onboarding
export const useOnboarding = () => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
    if (!hasCompletedOnboarding) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShouldShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startOnboarding = () => {
    setShouldShowOnboarding(true);
  };

  const completeOnboarding = () => {
    setShouldShowOnboarding(false);
    localStorage.setItem('onboarding-completed', 'true');
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding-completed');
    setShouldShowOnboarding(true);
  };

  return {
    shouldShowOnboarding: false, // Disabled for now
    startOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
};

// Made with Bob
