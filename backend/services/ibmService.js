import * as WatsonXAI from '@ibm-cloud/watsonx-ai';

// IBM watsonx.ai configuration
let watsonxClient = null;

/**
 * Initialize IBM watsonx.ai client
 */
export async function initializeWatsonX() {
  try {
    const apiKey = process.env.WATSONX_API_KEY;
    const projectId = process.env.WATSONX_PROJECT_ID;
    const url = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';

    if (!apiKey || !projectId) {
      console.warn('⚠️  IBM watsonx.ai credentials not configured. Using mock mode.');
      return null;
    }

    watsonxClient = WatsonXAI.newInstance({
      version: '2024-05-31',
      serviceUrl: url,
    });

    await watsonxClient.setServiceUrl(url);
    
    console.log('✅ IBM watsonx.ai client initialized successfully');
    return watsonxClient;
  } catch (error) {
    console.error('❌ Failed to initialize IBM watsonx.ai:', error.message);
    console.warn('⚠️  Falling back to mock mode');
    return null;
  }
}

/**
 * Get watsonx.ai client instance
 */
export function getWatsonXClient() {
  return watsonxClient;
}

/**
 * Check if IBM SDK is properly configured
 */
export function isIBMConfigured() {
  return watsonxClient !== null;
}

/**
 * Mock response for development/testing when IBM SDK is not configured
 */
export function getMockResponse(type) {
  const mockResponses = {
    schema: {
      columns: [
        { name: 'id', type: 'number', semantic: 'dimension', confidence: 0.95 },
        { name: 'name', type: 'string', semantic: 'dimension', confidence: 0.90 },
        { name: 'value', type: 'number', semantic: 'metric', confidence: 0.92 },
        { name: 'date', type: 'date', semantic: 'time', confidence: 0.88 }
      ],
      assumptions: [
        'Detected numeric ID column as primary dimension',
        'Identified value column as primary metric',
        'Date column appears to be in ISO format'
      ]
    },
    pipeline: {
      pipeline_code: `
// Transform CSV data for bar chart visualization
function transformData(data) {
  return data.map(row => ({
    label: row.name,
    value: parseFloat(row.value)
  })).sort((a, b) => b.value - a.value);
}
      `.trim(),
      chart_config: {
        xAxis: 'label',
        yAxis: 'value',
        dataKey: 'value'
      }
    },
    intent: {
      modified_code: `
// Transform CSV data for bar chart visualization with filters
function transformData(data) {
  return data
    .filter(row => parseFloat(row.value) >= 100)
    .map(row => ({
      label: row.name,
      value: parseFloat(row.value)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}
      `.trim(),
      explanation: 'Applied filter to exclude values less than 100 and limited results to top 10',
      changes: [
        'Added filter for values >= 100',
        'Limited results to top 10 items',
        'Maintained descending sort order'
      ]
    },
    summary: `
# Data Analysis Session Summary

## Data Source
- **File:** sample-data.csv
- **Rows Processed:** 150
- **Columns Detected:** 4

## Schema Detection
Successfully identified 4 columns with high confidence:
- ID (dimension, 95% confidence)
- Name (dimension, 90% confidence)
- Value (metric, 92% confidence)
- Date (time, 88% confidence)

## Transformations Applied
1. Initial pipeline generated for bar chart visualization
2. Applied filter: values >= 100
3. Limited results to top 10 items

## Business Rules
- "Exclude rows where value is less than 100"
- "Show only top 10 results"

## Final Insights
The analysis focused on high-value items, revealing the top 10 performers with values exceeding 100.
    `.trim()
  };

  return mockResponses[type] || null;
}

export default {
  initializeWatsonX,
  getWatsonXClient,
  isIBMConfigured,
  getMockResponse
};

// Made with Bob
