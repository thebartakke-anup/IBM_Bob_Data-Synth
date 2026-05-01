import { useState } from 'react';

interface RuleModifierProps {
  sessionId: string;
  onRuleApplied: (result: {
    explanation: string;
    changes: string[];
    data: any[];
    pipeline: any;
  }) => void;
}

const EXAMPLE_RULES = [
  "Exclude rows where value is less than 100",
  "Show only top 10 results",
  "Sort by ascending order",
  "Filter values greater than 200",
  "Show top 5 items"
];

export default function RuleModifier({ sessionId, onRuleApplied }: RuleModifierProps) {
  const [rule, setRule] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastExplanation, setLastExplanation] = useState<string | null>(null);
  const [lastChanges, setLastChanges] = useState<string[]>([]);

  const handleApplyRule = async () => {
    if (!rule.trim()) {
      setError('Please enter a rule');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/pipeline/rules/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rule: rule.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply rule');
      }

      const result = await response.json();
      
      setLastExplanation(result.explanation);
      setLastChanges(result.changes);
      setRule(''); // Clear input after successful application
      
      // Notify parent component
      onRuleApplied(result);
      
    } catch (err) {
      console.error('Error applying rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to apply rule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (exampleRule: string) => {
    setRule(exampleRule);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Modify Rules</h2>
        <p className="text-gray-600 mt-1">
          Describe changes in plain English and Bob will update the pipeline
        </p>
      </div>

      {/* Example Prompts */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Example Rules:</h3>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_RULES.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Rule Input */}
      <div className="mb-4">
        <label htmlFor="rule-input" className="block text-sm font-medium text-gray-700 mb-2">
          Your Rule:
        </label>
        <textarea
          id="rule-input"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          placeholder="e.g., Exclude rows where value is less than 100"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          disabled={isLoading}
        />
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApplyRule}
        disabled={isLoading || !rule.trim()}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Applying Rule...
          </span>
        ) : (
          '✨ Apply Rule'
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>❌ Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Last Explanation */}
      {lastExplanation && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ Bob's Explanation:</h3>
          <p className="text-sm text-green-700 mb-3">{lastExplanation}</p>
          
          {lastChanges.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-800 text-sm mb-1">Changes Applied:</h4>
              <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                {lastChanges.map((change, index) => (
                  <li key={index}>{change}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Be specific with your rules. Bob understands filters, sorting, 
          limits, and basic transformations.
        </p>
      </div>
    </div>
  );
}

// Made with Bob