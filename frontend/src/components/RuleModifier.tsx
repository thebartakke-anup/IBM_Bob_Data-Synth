import { useState, useEffect } from 'react';

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
  "Show top 5 items",
  "Remove duplicates",
  "Convert to uppercase",
  "Calculate average"
];

const RULE_TEMPLATES = [
  { category: 'Filtering', rules: ['Exclude rows where', 'Show only rows where', 'Filter by'] },
  { category: 'Sorting', rules: ['Sort by ascending', 'Sort by descending', 'Order by'] },
  { category: 'Limiting', rules: ['Show top 10', 'Show bottom 5', 'Limit to'] },
  { category: 'Transformation', rules: ['Convert to uppercase', 'Convert to lowercase', 'Remove duplicates'] },
];

export default function RuleModifier({ sessionId, onRuleApplied }: RuleModifierProps) {
  const [rule, setRule] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastExplanation, setLastExplanation] = useState<string | null>(null);
  const [lastChanges, setLastChanges] = useState<string[]>([]);
  const [ruleHistory, setRuleHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showTemplates, setShowTemplates] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setCharCount(rule.length);
    
    // Simple AI-powered suggestions based on input
    if (rule.length > 3) {
      const lowerRule = rule.toLowerCase();
      const newSuggestions: string[] = [];
      
      if (lowerRule.includes('filter') || lowerRule.includes('exclude')) {
        newSuggestions.push('Exclude rows where value is less than 100');
      }
      if (lowerRule.includes('sort') || lowerRule.includes('order')) {
        newSuggestions.push('Sort by ascending order');
      }
      if (lowerRule.includes('top') || lowerRule.includes('limit')) {
        newSuggestions.push('Show only top 10 results');
      }
      
      setSuggestions(newSuggestions.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  }, [rule]);

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
      
      // Add to history
      setRuleHistory(prev => [...prev, rule.trim()]);
      setHistoryIndex(-1);
      
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

  const handleUndo = () => {
    if (historyIndex < ruleHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setRule(ruleHistory[ruleHistory.length - 1 - newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setRule(ruleHistory[ruleHistory.length - 1 - newIndex]);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setRule('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to apply
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleApplyRule();
    }
    // Ctrl/Cmd + Z to undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    }
    // Ctrl/Cmd + Shift + Z to redo
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
      e.preventDefault();
      handleRedo();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 rule-modifier">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">✏️ Modify Rules</h2>
            <p className="text-gray-600 mt-1">
              Describe changes in plain English and Bob will update the pipeline
            </p>
          </div>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 text-sm font-medium"
          >
            {showTemplates ? '✕ Close' : '📚 Templates'}
          </button>
        </div>
      </div>

      {/* Rule Templates */}
      {showTemplates && (
        <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-900 mb-3">Rule Templates by Category:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RULE_TEMPLATES.map((template, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-purple-100">
                <h4 className="font-semibold text-purple-800 text-sm mb-2">{template.category}</h4>
                <div className="space-y-1">
                  {template.rules.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setRule(r);
                        setShowTemplates(false);
                      }}
                      className="block w-full text-left px-2 py-1 text-xs text-purple-700 hover:bg-purple-50 rounded transition-colors"
                      disabled={isLoading}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Prompts */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Examples:</h3>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_RULES.slice(0, 5).map((example, index) => (
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
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="rule-input" className="block text-sm font-medium text-gray-700">
            Your Rule:
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{charCount} characters</span>
            {ruleHistory.length > 0 && (
              <div className="flex gap-1">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex >= ruleHistory.length - 1}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  ↶ Undo
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex < 0}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  ↷ Redo
                </button>
              </div>
            )}
          </div>
        </div>
        <textarea
          id="rule-input"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Exclude rows where value is less than 100"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          disabled={isLoading}
        />
        
        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-semibold text-amber-800 mb-1">💡 AI Suggestions:</p>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setRule(suggestion)}
                  className="px-2 py-1 text-xs bg-white text-amber-700 rounded hover:bg-amber-100 transition-colors border border-amber-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
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
          <>✨ Apply Rule <span className="text-xs opacity-75">(Ctrl+Enter)</span></>
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

      {/* Rule History */}
      {ruleHistory.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">📜 Recent Rules:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {ruleHistory.slice(-5).reverse().map((historyRule, idx) => (
              <button
                key={idx}
                onClick={() => setRule(historyRule)}
                className="block w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors truncate"
              >
                {historyRule}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tips:</strong> Be specific with your rules. Bob understands filters, sorting,
          limits, and basic transformations. Use <kbd className="px-1 py-0.5 bg-white rounded text-xs">Ctrl+Enter</kbd> to apply quickly.
        </p>
      </div>
    </div>
  );
}

// Made with Bob