import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PipelineViewerProps {
  code: string;
  chartConfig: {
    xAxis: string;
    yAxis: string;
    dataKey: string;
  };
  onRegenerate?: () => void;
}

export default function PipelineViewer({ code, chartConfig, onRegenerate }: PipelineViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  // Copy code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy code. Please try again.');
    }
  };

  // Download code as file
  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const link = document.createElement('a');
    link.download = `pipeline-${Date.now()}.js`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  // Highlight search term in code
  const highlightCode = (codeString: string) => {
    if (!searchTerm) return codeString;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return codeString.replace(regex, '⟪$1⟫');
  };

  // Calculate code metrics
  const codeLines = code.split('\n').length;
  const codeChars = code.length;
  const codeWords = code.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transformation Pipeline</h2>
          <p className="text-gray-600 mt-1">Generated code to transform your data</p>
        </div>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              title="Regenerate Pipeline"
            >
              🔄 Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Chart Configuration */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Chart Configuration</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">X-Axis:</span>
            <span className="ml-2 font-mono text-blue-600">{chartConfig.xAxis}</span>
          </div>
          <div>
            <span className="text-gray-600">Y-Axis:</span>
            <span className="ml-2 font-mono text-blue-600">{chartConfig.yAxis}</span>
          </div>
          <div>
            <span className="text-gray-600">Data Key:</span>
            <span className="ml-2 font-mono text-blue-600">{chartConfig.dataKey}</span>
          </div>
        </div>
      </div>

      {/* Code Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm text-blue-600 font-semibold mb-1">Lines</div>
          <div className="text-xl font-bold text-blue-900">{codeLines}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-sm text-green-600 font-semibold mb-1">Words</div>
          <div className="text-xl font-bold text-green-900">{codeWords}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-sm text-purple-600 font-semibold mb-1">Characters</div>
          <div className="text-xl font-bold text-purple-900">{codeChars}</div>
        </div>
      </div>

      {/* Code Display Controls */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-semibold text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <span>{isExpanded ? '▼' : '▶'}</span>
            <span>Generated Code</span>
            <span className="text-sm text-gray-500">({codeLines} lines)</span>
          </button>
          
          {isExpanded && (
            <div className="flex items-center gap-2">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {isDarkTheme ? '☀️' : '🌙'}
              </button>
              
              {/* Line Numbers Toggle */}
              <button
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                title={showLineNumbers ? 'Hide Line Numbers' : 'Show Line Numbers'}
              >
                {showLineNumbers ? '#' : '≡'}
              </button>
              
              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title="Copy to Clipboard"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              
              {/* Download Button */}
              <button
                onClick={downloadCode}
                className="px-3 py-1 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                title="Download Code"
              >
                💾 Download
              </button>
            </div>
          )}
        </div>
        
        {isExpanded && (
          <div className="max-h-96 overflow-auto">
            <SyntaxHighlighter
              language="javascript"
              style={isDarkTheme ? vscDarkPlus : vs}
              showLineNumbers={showLineNumbers}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}
              lineNumberStyle={{
                minWidth: '3em',
                paddingRight: '1em',
                color: isDarkTheme ? '#858585' : '#999',
                userSelect: 'none'
              }}
            >
              {searchTerm ? highlightCode(code) : code}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {/* Search Results */}
      {isExpanded && searchTerm && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            {code.toLowerCase().includes(searchTerm.toLowerCase())
              ? `✓ Found "${searchTerm}" in code`
              : `✗ "${searchTerm}" not found in code`}
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Developer Note:</strong> This code is executed in a sandboxed environment
          for security. You can review, copy, and modify it before deploying to production.
        </p>
      </div>

      {/* Keyboard Shortcuts */}
      {isExpanded && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">⌨️ Keyboard Shortcuts</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Ctrl+C</kbd> Copy selected text</div>
            <div><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Ctrl+F</kbd> Search in code</div>
            <div><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Ctrl+A</kbd> Select all</div>
            <div><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Esc</kbd> Clear search</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob - Phase 2 Enhanced
