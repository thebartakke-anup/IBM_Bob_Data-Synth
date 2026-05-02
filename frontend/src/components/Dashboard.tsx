import { useState, useRef } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Brush
} from 'recharts';
import html2canvas from 'html2canvas';

interface DashboardProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  chartConfig: {
    xAxis: string;
    yAxis: string;
    dataKey: string;
  };
  confidence?: number;
}

type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'];

export default function Dashboard({ data, chartConfig, confidence = 0.85 }: DashboardProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Calculate confidence badge color
  const getConfidenceBadge = (score: number) => {
    if (score >= 0.8) {
      return { color: 'bg-green-100 text-green-800 border-green-300', label: 'High Confidence' };
    } else if (score >= 0.5) {
      return { color: 'bg-amber-100 text-amber-800 border-amber-300', label: 'Medium Confidence' };
    } else {
      return { color: 'bg-red-100 text-red-800 border-red-300', label: 'Low Confidence' };
    }
  };

  const badge = getConfidenceBadge(confidence);

  // Calculate statistics
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const avgValue = data.length > 0 ? totalValue / data.length : 0;
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
  const minValue = data.length > 0 ? Math.min(...data.map(d => d.value)) : 0;

  // Export chart as PNG
  const exportChart = async (format: 'png' | 'svg') => {
    if (!chartRef.current) return;

    try {
      if (format === 'png') {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: '#ffffff',
          scale: 2
        });
        const link = document.createElement('a');
        link.download = `chart-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        // For SVG, we'll use a simple approach
        alert('SVG export coming soon! Use PNG for now.');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export chart. Please try again.');
    }
  };

  // Export data as CSV
  const exportData = () => {
    const csv = [
      ['Label', 'Value'],
      ...data.map(item => [item.label, item.value])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `data-${Date.now()}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Render the appropriate chart based on type
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={chartConfig.xAxis}
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#4b5563', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: '#4b5563', fontSize: 12 }}
              label={{ value: chartConfig.yAxis, angle: -90, position: 'insideLeft', style: { fill: '#4b5563' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number) => [value.toFixed(2), 'Value']}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Brush dataKey={chartConfig.xAxis} height={30} stroke="#3b82f6" />
            <Bar
              dataKey={chartConfig.dataKey}
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              name="Value"
            />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={chartConfig.xAxis}
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#4b5563', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: '#4b5563', fontSize: 12 }}
              label={{ value: chartConfig.yAxis, angle: -90, position: 'insideLeft', style: { fill: '#4b5563' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number) => [value.toFixed(2), 'Value']}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Brush dataKey={chartConfig.xAxis} height={30} stroke="#8b5cf6" />
            <Line
              type="monotone"
              dataKey={chartConfig.dataKey}
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 5 }}
              activeDot={{ r: 8 }}
              name="Value"
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={chartConfig.xAxis}
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#4b5563', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: '#4b5563', fontSize: 12 }}
              label={{ value: chartConfig.yAxis, angle: -90, position: 'insideLeft', style: { fill: '#4b5563' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number) => [value.toFixed(2), 'Value']}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Brush dataKey={chartConfig.xAxis} height={30} stroke="#10b981" />
            <Area
              type="monotone"
              dataKey={chartConfig.dataKey}
              stroke="#10b981"
              strokeWidth={2}
              fill="#10b981"
              fillOpacity={0.3}
              name="Value"
            />
          </AreaChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={chartConfig.xAxis}
              type="category"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#4b5563', fontSize: 12 }}
            />
            <YAxis
              dataKey={chartConfig.dataKey}
              type="number"
              tick={{ fill: '#4b5563', fontSize: 12 }}
              label={{ value: chartConfig.yAxis, angle: -90, position: 'insideLeft', style: { fill: '#4b5563' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number) => [value.toFixed(2), 'Value']}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Scatter
              name="Value"
              dataKey={chartConfig.dataKey}
              fill="#ec4899"
            />
          </ScatterChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={chartConfig.dataKey}
              nameKey={chartConfig.xAxis}
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number) => [value.toFixed(2), 'Value']}
            />
            <Legend />
          </PieChart>
        );

      default:
        return null;
    }
  };

  const chartTypeButtons: { type: ChartType; icon: string; label: string }[] = [
    { type: 'bar', icon: '📊', label: 'Bar' },
    { type: 'line', icon: '📈', label: 'Line' },
    { type: 'area', icon: '📉', label: 'Area' },
    { type: 'pie', icon: '🥧', label: 'Pie' },
    { type: 'scatter', icon: '⚫', label: 'Scatter' }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Visualization</h2>
          <p className="text-gray-600 mt-1">Interactive charts with multiple visualization types</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-lg border ${badge.color}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {confidence >= 0.8 ? '✓' : confidence >= 0.5 ? '⚠' : '⚠'}
              </span>
              <div>
                <div className="font-semibold">{badge.label}</div>
                <div className="text-sm">{(confidence * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? '🗗' : '⛶'}
          </button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-gray-700">Chart Type:</span>
          <div className="flex gap-2">
            {chartTypeButtons.map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  chartType === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-semibold mb-1">Total Items</div>
          <div className="text-2xl font-bold text-blue-900">{data.length}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-semibold mb-1">Average</div>
          <div className="text-2xl font-bold text-green-900">{avgValue.toFixed(1)}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-semibold mb-1">Maximum</div>
          <div className="text-2xl font-bold text-purple-900">{maxValue.toFixed(1)}</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-orange-600 font-semibold mb-1">Minimum</div>
          <div className="text-2xl font-bold text-orange-900">{minValue.toFixed(1)}</div>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <ResponsiveContainer width="100%" height={isFullscreen ? 600 : 400}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => exportChart('png')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            📥 Export PNG
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            📊 Export CSV
          </button>
        </div>
        <button
          onClick={() => setShowDataTable(!showDataTable)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {showDataTable ? '📊 Hide Table' : '📋 Show Table'}
        </button>
      </div>

      {/* Data Table Preview */}
      {showDataTable && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-3">Data Table</h3>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {item.value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Use the Brush tool (bottom of chart) to zoom into specific data ranges. 
          Switch between chart types to find the best visualization for your data.
        </p>
      </div>
    </div>
  );
}

// Made with Bob - Phase 2 Enhanced
