import React, { useState, useEffect } from 'react';
import Joyride, { STATUS, type Step } from 'react-joyride';

interface OnboardingTourProps {
  run?: boolean;
  onComplete?: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ run = false, onComplete }) => {
  const [runTour, setRunTour] = useState(run);

  useEffect(() => {
    setRunTour(run);
  }, [run]);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">Welcome to Data-Synth! 🎉</h2>
          <p className="text-gray-600">
            Let's take a quick tour to help you get started with our AI-powered data pipeline platform.
          </p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '.file-upload-zone',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">📁 Step 1: Upload Your Data</h3>
          <p className="text-gray-600">
            Start by uploading your CSV file here. You can drag and drop or click to browse.
            We support files up to 10MB.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.schema-viewer',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">🔍 Step 2: Review Schema</h3>
          <p className="text-gray-600">
            Our AI will automatically detect your data schema, including column types and semantic meanings.
            Review the confidence scores and assumptions made.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.pipeline-viewer',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">⚙️ Step 3: Generate Pipeline</h3>
          <p className="text-gray-600">
            Once you approve the schema, we'll generate a complete data pipeline code.
            You can copy, download, or modify the code as needed.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.dashboard-charts',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">📊 Step 4: Visualize Data</h3>
          <p className="text-gray-600">
            Explore your data with interactive charts. Switch between different chart types,
            zoom, pan, and export visualizations.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.rule-modifier',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">✏️ Step 5: Modify Rules</h3>
          <p className="text-gray-600">
            Customize data transformation rules using natural language.
            Our AI will help you create complex rules easily.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.audit-log',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">📝 Step 6: Track Changes</h3>
          <p className="text-gray-600">
            View a complete history of all actions and changes made to your pipeline.
            You can rollback to previous states if needed.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.theme-toggle',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">🌙 Bonus: Dark Mode</h3>
          <p className="text-gray-600">
            Toggle between light and dark themes for comfortable viewing.
            Your preference will be saved automatically.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">You're All Set! 🚀</h2>
          <p className="text-gray-600 mb-3">
            You now know the basics of Data-Synth. Start by uploading your first file!
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> Press <kbd className="px-2 py-1 bg-white rounded border">?</kbd> anytime to see keyboard shortcuts.
            </p>
          </div>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      if (onComplete) {
        onComplete();
      }
      // Save that user has completed the tour
      localStorage.setItem('onboarding-completed', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#3b82f6',
          textColor: '#374151',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: '#ffffff',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          padding: '8px 16px',
          fontSize: '14px',
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#9ca3af',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
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
    shouldShowOnboarding,
    startOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
};

// Made with Bob
