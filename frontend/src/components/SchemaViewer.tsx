interface Column {
  name: string;
  type: string;
  semantic: string;
  confidence: number;
}

interface SchemaViewerProps {
  schema: {
    columns: Column[];
    assumptions: string[];
  };
  filename: string;
  rowCount: number;
  onApprove: () => void;
}

export default function SchemaViewer({ schema, filename, rowCount, onApprove }: SchemaViewerProps) {
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'High',
        icon: '✓'
      };
    } else if (confidence >= 0.5) {
      return {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Medium',
        icon: '⚠'
      };
    } else {
      return {
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Low',
        icon: '✗'
      };
    }
  };

  const getSemanticBadge = (semantic: string) => {
    const colors: Record<string, string> = {
      dimension: 'bg-blue-100 text-blue-800',
      metric: 'bg-purple-100 text-purple-800',
      time: 'bg-indigo-100 text-indigo-800'
    };
    return colors[semantic] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Schema Detected</h2>
            <p className="text-sm text-gray-500 mt-1">
              File: <span className="font-medium">{filename}</span> • {rowCount} rows
            </p>
          </div>
          <button
            onClick={onApprove}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Approve Schema
          </button>
        </div>
      </div>

      {/* Schema Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Detected Columns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Column Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semantic Meaning
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schema.columns.map((column, index) => {
                const confidenceBadge = getConfidenceBadge(column.confidence);
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{column.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {column.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSemanticBadge(column.semantic)}`}>
                        {column.semantic}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${confidenceBadge.color}`}>
                          <span className="mr-1">{confidenceBadge.icon}</span>
                          {confidenceBadge.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(column.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assumption Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bob's Assumptions
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              IBM Bob analyzed your data and made the following inferences:
            </p>
            <div className="space-y-2">
              {schema.assumptions.map((assumption, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-700 flex-1">{assumption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Columns</p>
              <p className="text-2xl font-bold text-gray-900">{schema.columns.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Confidence</p>
              <p className="text-2xl font-bold text-gray-900">
                {(schema.columns.reduce((sum, col) => sum + col.confidence, 0) / schema.columns.length * 100).toFixed(0)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Data Rows</p>
              <p className="text-2xl font-bold text-gray-900">{rowCount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
