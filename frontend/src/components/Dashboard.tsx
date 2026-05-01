import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function Dashboard({ data, chartConfig, confidence = 0.85 }: DashboardProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Visualization</h2>
          <p className="text-gray-600 mt-1">Interactive bar chart of transformed data</p>
        </div>
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
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-semibold mb-1">Total Items</div>
          <div className="text-2xl font-bold text-blue-900">{data.length}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-semibold mb-1">Average Value</div>
          <div className="text-2xl font-bold text-green-900">{avgValue.toFixed(1)}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-semibold mb-1">Max Value</div>
          <div className="text-2xl font-bold text-purple-900">{maxValue.toFixed(1)}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
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
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar
              dataKey={chartConfig.dataKey}
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              name="Value"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table Preview */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-3">Data Preview (Top 5)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 5).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
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
        {data.length > 5 && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            Showing 5 of {data.length} items
          </p>
        )}
      </div>
    </div>
  );
}

// Made with Bob
