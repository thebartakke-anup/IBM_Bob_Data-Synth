import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transformation Pipeline</h2>
          <p className="text-gray-600 mt-1">Generated code to transform your data</p>
        </div>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Regenerate
          </button>
        )}
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

      {/* Code Display */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-between"
        >
          <span className="font-semibold text-gray-700">
            {isExpanded ? '▼' : '▶'} View Generated Code
          </span>
          <span className="text-sm text-gray-500">
            {code.split('\n').length} lines
          </span>
        </button>
        
        {isExpanded && (
          <div className="max-h-96 overflow-auto">
            <SyntaxHighlighter
              language="javascript"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '0.875rem'
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Developer Note:</strong> This code is executed in a sandboxed environment
          for security. You can review and modify it before deploying to production.
        </p>
      </div>
    </div>
  );
}

// Made with Bob
