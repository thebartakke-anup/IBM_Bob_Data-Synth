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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Audit Trail</h2>
          <p className="text-gray-600 mt-1">
            Complete history of all actions and decisions
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {isExpanded ? '▼ Collapse' : '▶ Expand'}
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No audit entries yet
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getActionIcon(entry.action)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800">
                      {getActionLabel(entry.action)}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-2 text-sm text-gray-600">
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