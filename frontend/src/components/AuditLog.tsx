import { useState, useEffect } from 'react';

interface AuditEntry {
  id: number;
  timestamp: string;
  action: string;
  details: any;
}

interface AuditLogProps {
  sessionId: string;
}

export default function AuditLog({ sessionId }: AuditLogProps) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  useEffect(() => {
    loadAuditLog();
  }, [sessionId]);

  const loadAuditLog = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3001/api/pipeline/audit/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load audit log');
      }

      const data = await response.json();
      setEntries(data.entries);
      setError(null);
    } catch (err) {
      console.error('Error loading audit log:', err);
      setError(err instanceof Error ? err.message : 'Failed to load audit log');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      const response = await fetch(`http://localhost:3001/api/summary/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.summary);
      setShowSummary(true);
      
      // Refresh audit log to show the summary_generated entry
      await loadAuditLog();
    } catch (err) {
      console.error('Error generating summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const exportSession = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/export/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to export session');
      }

      const data = await response.json();
      
      // Create a blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-synth-session-${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Refresh audit log to show the session_exported entry
      await loadAuditLog();
    } catch (err) {
      console.error('Error exporting session:', err);
      setError(err instanceof Error ? err.message : 'Failed to export session');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'session_created':
        return '🆕';
      case 'file_uploaded':
        return '📤';
      case 'schema_detected':
        return '🔍';
      case 'pipeline_generated':
        return '⚙️';
      case 'rule_applied':
        return '✨';
      case 'summary_generated':
        return '📋';
      case 'session_exported':
        return '💾';
      default:
        return '📝';
    }
  };

  const getActionLabel = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'session_created':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'file_uploaded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'schema_detected':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pipeline_generated':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'rule_applied':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'summary_generated':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'session_exported':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(entry.details).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterAction === 'all' || entry.action === filterAction;
    
    return matchesSearch && matchesFilter;
  });

  const uniqueActions = Array.from(new Set(entries.map(e => e.action)));

  const getActivityStats = () => {
    return {
      total: entries.length,
      rulesApplied: entries.filter(e => e.action === 'rule_applied').length,
      filesUploaded: entries.filter(e => e.action === 'file_uploaded').length,
      pipelinesGenerated: entries.filter(e => e.action === 'pipeline_generated').length,
    };
  };

  const stats = getActivityStats();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <span className="animate-spin text-3xl">⏳</span>
          <span className="ml-3 text-gray-600">Loading audit log...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>❌ Error:</strong> {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 audit-log">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📝 Audit Trail</h2>
          <p className="text-gray-600 mt-1">
            Complete history of all actions and decisions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'timeline' : 'list')}
            className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 text-sm"
          >
            {viewMode === 'list' ? '📅 Timeline' : '📋 List'}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isExpanded ? '▼ Collapse' : '▶ Expand'}
          </button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
          <div className="text-xs text-blue-600">Total Actions</div>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <div className="text-2xl font-bold text-amber-700">{stats.rulesApplied}</div>
          <div className="text-xs text-amber-600">Rules Applied</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-700">{stats.filesUploaded}</div>
          <div className="text-xs text-green-600">Files Uploaded</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-700">{stats.pipelinesGenerated}</div>
          <div className="text-xs text-purple-600">Pipelines Generated</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Search audit log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>
              {getActionLabel(action)}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={generateSummary}
          disabled={isGeneratingSummary}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isGeneratingSummary ? (
            <>
              <span className="animate-spin inline-block mr-2">⏳</span>
              Generating Summary...
            </>
          ) : (
            <>
              📋 Generate Session Summary
            </>
          )}
        </button>
        <button
          onClick={exportSession}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          💾 Export Session Data
        </button>
      </div>

      {/* Summary Display */}
      {showSummary && summary && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-blue-900">📊 Session Summary</h3>
            <button
              onClick={() => setShowSummary(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ✕
            </button>
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
              {summary}
            </pre>
          </div>
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm || filterAction !== 'all' ? 'No matching entries found' : 'No audit entries yet'}
        </div>
      ) : viewMode === 'timeline' ? (
        /* Timeline View */
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {filteredEntries.map((entry, index) => (
              <div key={entry.id} className="relative pl-16">
                <div className="absolute left-5 top-2 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                  <span className="text-xs">{getActionIcon(entry.action)}</span>
                </div>
                <div
                  className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getActionColor(entry.action)}`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">
                      {getActionLabel(entry.action)}
                    </h3>
                    <span className="text-xs opacity-75">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="mt-2 text-sm opacity-90">
                      {entry.action === 'rule_applied' && entry.details.rule && (
                        <div>"{entry.details.rule}"</div>
                      )}
                      {entry.action === 'file_uploaded' && entry.details.filename && (
                        <div>📁 {entry.details.filename}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredEntries.map((entry, index) => (
            <div
              key={entry.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getActionColor(entry.action)}`}
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getActionIcon(entry.action)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">
                      {getActionLabel(entry.action)}
                    </h3>
                    <span className="text-xs opacity-75">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-2 text-sm opacity-90">
                      {entry.action === 'rule_applied' && entry.details.rule && (
                        <div className="space-y-2">
                          <div>
                            <strong>Rule:</strong> "{entry.details.rule}"
                          </div>
                          {entry.details.explanation && (
                            <div>
                              <strong>Explanation:</strong> {entry.details.explanation}
                            </div>
                          )}
                          {entry.details.changes && entry.details.changes.length > 0 && (
                            <div>
                              <strong>Changes:</strong>
                              <ul className="list-disc list-inside ml-4 mt-1">
                                {entry.details.changes.map((change: string, i: number) => (
                                  <li key={i}>{change}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {entry.action === 'schema_detected' && entry.details.columns_detected && (
                        <div>
                          <strong>Columns Detected:</strong> {entry.details.columns_detected}
                        </div>
                      )}
                      
                      {entry.action === 'pipeline_generated' && (
                        <div>
                          <strong>Rows Transformed:</strong> {entry.details.rows_transformed || 'N/A'}
                        </div>
                      )}
                      
                      {entry.action === 'file_uploaded' && entry.details.filename && (
                        <div>
                          <strong>File:</strong> {entry.details.filename}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEntry(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`p-6 border-b ${getActionColor(selectedEntry.action)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getActionIcon(selectedEntry.action)}</span>
                  <div>
                    <h3 className="text-xl font-bold">{getActionLabel(selectedEntry.action)}</h3>
                    <p className="text-sm opacity-75">{formatTimestamp(selectedEntry.timestamp)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(selectedEntry.details, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={loadAuditLog}
          className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}

// Made with Bob