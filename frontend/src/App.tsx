import { useState } from 'react';
import FileUpload from './components/FileUpload';
import SchemaViewer from './components/SchemaViewer';
import './App.css';

interface UploadData {
  sessionId: string;
  filename: string;
  rowCount: number;
  schema: {
    id: string;
    columns: Array<{
      name: string;
      type: string;
      semantic: string;
      confidence: number;
    }>;
    assumptions: string[];
  };
}

function App() {
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [isSchemaApproved, setIsSchemaApproved] = useState(false);

  const handleUploadSuccess = (data: UploadData) => {
    console.log('Upload successful:', data);
    setUploadData(data);
    setIsSchemaApproved(false);
  };

  const handleApproveSchema = () => {
    console.log('Schema approved for session:', uploadData?.sessionId);
    setIsSchemaApproved(true);
    // TODO: Move to Phase 2 - Pipeline Generation
    alert('Schema approved! Ready for Phase 2: Pipeline Generation');
  };

  const handleReset = () => {
    setUploadData(null);
    setIsSchemaApproved(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Data-Synth</h1>
                <p className="text-sm text-gray-500">Powered by IBM Bob</p>
              </div>
            </div>
            {uploadData && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Upload New File
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Phase Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${uploadData ? 'text-green-600' : 'text-blue-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${uploadData ? 'bg-green-100' : 'bg-blue-100'}`}>
                {uploadData ? '✓' : '1'}
              </div>
              <span className="ml-2 font-medium">Upload & Schema</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${isSchemaApproved ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isSchemaApproved ? 'bg-blue-100' : 'bg-gray-100'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Pipeline</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center text-gray-400">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold">
                3
              </div>
              <span className="ml-2 font-medium">Rules</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center text-gray-400">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold">
                4
              </div>
              <span className="ml-2 font-medium">Audit</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {!uploadData ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Phase 1: CSV Upload & Schema Detection
              </h2>
              <p className="text-lg text-gray-600">
                Upload your CSV file and let IBM Bob analyze the schema
              </p>
            </div>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            
            {/* Instructions */}
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works:</h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Upload a CSV file (max 10MB)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>IBM Bob analyzes the data and detects column types</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Review the detected schema with confidence scores</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>Approve the schema to proceed to pipeline generation</span>
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <SchemaViewer
            schema={uploadData.schema}
            filename={uploadData.filename}
            rowCount={uploadData.rowCount}
            onApprove={handleApproveSchema}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Built with IBM Bob for the IBM Hackathon 2026
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Phase 1 of 4</span>
              <span>•</span>
              <span>MVP Demo</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
