import { useState } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ui/ThemeToggle';
import FileUpload from './components/FileUpload';
import SchemaViewer from './components/SchemaViewer';
import PipelineViewer from './components/PipelineViewer';
import Dashboard from './components/Dashboard';
import RuleModifier from './components/RuleModifier';
import AuditLog from './components/AuditLog';
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

interface PipelineData {
  pipelineId: string;
  pipeline: {
    code: string;
    chartConfig: {
      xAxis: string;
      yAxis: string;
      dataKey: string;
    };
  };
  preview: Array<{
    label: string;
    value: number;
  }>;
}

interface ChartData {
  data: Array<{
    label: string;
    value: number;
  }>;
  chartConfig: {
    xAxis: string;
    yAxis: string;
    dataKey: string;
  };
}

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [isSchemaApproved, setIsSchemaApproved] = useState(false);
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isGeneratingPipeline, setIsGeneratingPipeline] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = (data: UploadData) => {
    console.log('Upload successful:', data);
    setUploadData(data);
    setIsSchemaApproved(false);
    setPipelineData(null);
    setChartData(null);
    setError(null);
  };

  const handleApproveSchema = async () => {
    if (!uploadData) return;
    
    console.log('Schema approved for session:', uploadData.sessionId);
    setIsSchemaApproved(true);
    setError(null);
    
    // Automatically generate pipeline
    await generatePipeline();
  };

  const generatePipeline = async () => {
    if (!uploadData) return;
    
    setIsGeneratingPipeline(true);
    setError(null);
    
    try {
      console.log('Generating pipeline for session:', uploadData.sessionId);
      
      const response = await axios.post<{ success: boolean } & PipelineData>(
        `${API_BASE_URL}/pipeline/${uploadData.sessionId}`
      );
      
      if (response.data.success) {
        console.log('Pipeline generated successfully:', response.data);
        setPipelineData(response.data);
        
        // Load chart data
        await loadChartData();
      }
    } catch (err: any) {
      console.error('Pipeline generation error:', err);
      setError(err.response?.data?.message || 'Failed to generate pipeline');
    } finally {
      setIsGeneratingPipeline(false);
    }
  };

  const loadChartData = async () => {
    if (!uploadData) return;
    
    setIsLoadingData(true);
    setError(null);
    
    try {
      console.log('Loading chart data for session:', uploadData.sessionId);
      
      const response = await axios.get<{ success: boolean } & ChartData>(
        `${API_BASE_URL}/data/${uploadData.sessionId}`
      );
      
      if (response.data.success) {
        console.log('Chart data loaded successfully:', response.data);
        setChartData(response.data);
      }
    } catch (err: any) {
      console.error('Data loading error:', err);
      setError(err.response?.data?.message || 'Failed to load chart data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleRegeneratePipeline = async () => {
    setPipelineData(null);
    setChartData(null);
    await generatePipeline();
  };

  const handleRuleApplied = (result: any) => {
    console.log('Rule applied successfully:', result);
    
    // Update pipeline data
    if (result.pipeline) {
      setPipelineData({
        pipelineId: result.pipelineId,
        pipeline: result.pipeline,
        preview: result.data.slice(0, 10)
      });
    }
    
    // Update chart data
    if (result.data && result.pipeline?.chartConfig) {
      setChartData({
        data: result.data,
        chartConfig: result.pipeline.chartConfig
      });
    }
  };

  const handleReset = () => {
    setUploadData(null);
    setIsSchemaApproved(false);
    setPipelineData(null);
    setChartData(null);
    setError(null);
  };

  // Calculate average confidence from schema
  const getAverageConfidence = () => {
    if (!uploadData?.schema.columns) return 0.85;
    const total = uploadData.schema.columns.reduce((sum, col) => sum + col.confidence, 0);
    return total / uploadData.schema.columns.length;
  };

  return (
    <ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Data-Synth</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Powered by IBM Bob</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {uploadData && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Upload New File
                </button>
              )}
            </div>
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
            <div className={`flex items-center ${chartData ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${chartData ? 'bg-blue-100' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Rules</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${chartData ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${chartData ? 'bg-blue-100' : 'bg-gray-100'}`}>
                4
              </div>
              <span className="ml-2 font-medium">Audit</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-600 text-xl mr-2">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

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
        ) : !isSchemaApproved ? (
          <SchemaViewer
            schema={uploadData.schema}
            filename={uploadData.filename}
            rowCount={uploadData.rowCount}
            onApprove={handleApproveSchema}
          />
        ) : (
          <div className="space-y-6">
            {/* Phase 2 Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Phase 2: Pipeline Generation & Visualization
              </h2>
              <p className="text-lg text-gray-600">
                IBM Bob generates transformation code and visualizes your data
              </p>
            </div>

            {/* Loading State */}
            {isGeneratingPipeline && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Generating Pipeline...
                </h3>
                <p className="text-gray-600">
                  IBM Bob is analyzing your schema and creating transformation code
                </p>
              </div>
            )}

            {/* Pipeline Viewer */}
            {pipelineData && !isGeneratingPipeline && (
              <PipelineViewer
                code={pipelineData.pipeline.code}
                chartConfig={pipelineData.pipeline.chartConfig}
                onRegenerate={handleRegeneratePipeline}
              />
            )}

            {/* Loading Chart Data */}
            {isLoadingData && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Loading Data...
                </h3>
                <p className="text-gray-600">
                  Transforming your data for visualization
                </p>
              </div>
            )}

            {/* Dashboard with Chart */}
            {chartData && !isLoadingData && (
              <>
                <Dashboard
                  data={chartData.data}
                  chartConfig={chartData.chartConfig}
                  confidence={getAverageConfidence()}
                />

                {/* Phase 3: Rule Modifier */}
                <div className="mt-8">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Phase 3: Modify Rules
                    </h2>
                    <p className="text-lg text-gray-600">
                      Describe changes in plain English and Bob will update the pipeline
                    </p>
                  </div>
                  <RuleModifier
                    sessionId={uploadData.sessionId}
                    onRuleApplied={handleRuleApplied}
                  />
                </div>

                {/* Phase 4: Audit Trail */}
                <div className="mt-8">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Phase 4: Audit Trail
                    </h2>
                    <p className="text-lg text-gray-600">
                      Complete history of all actions and decisions
                    </p>
                  </div>
                  <AuditLog sessionId={uploadData.sessionId} />
                </div>
              </>
            )}
          </div>
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
              <span>
                {!uploadData ? 'Phase 1' : !isSchemaApproved ? 'Phase 1' : !chartData ? 'Phase 2' : 'Phase 3-4'} of 4
              </span>
              <span>•</span>
              <span>MVP Demo</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </ThemeProvider>
  );
}

export default App;

// Made with Bob
