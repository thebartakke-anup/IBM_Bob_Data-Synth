import express from 'express';
import { randomUUID } from 'crypto';
import db from '../db/init.js';
import { isIBMConfigured, getMockResponse } from '../services/ibmService.js';
import { VM } from 'vm2';

const router = express.Router();

/**
 * Generate transformation pipeline code using IBM Bob
 */
async function generatePipeline(schema, sampleData) {
  // For now, use mock response
  // TODO: Integrate real IBM Bob SDK when credentials are available
  
  if (isIBMConfigured()) {
    console.log('Using IBM Bob for pipeline generation...');
    // Real IBM Bob integration would go here
    // const result = await callIBMBob(schema, sampleData);
    // return result;
  }
  
  console.log('Using mock pipeline generation...');
  
  // Analyze schema to determine best visualization approach
  const metricColumns = schema.columns.filter(c => c.semantic === 'metric');
  const dimensionColumns = schema.columns.filter(c => c.semantic === 'dimension');
  
  // Generate pipeline code based on schema
  let pipelineCode = '';
  let chartConfig = {};
  
  if (metricColumns.length > 0 && dimensionColumns.length > 0) {
    const metricCol = metricColumns[0].name;
    const dimensionCol = dimensionColumns[0].name;
    
    pipelineCode = `
// Transform CSV data for bar chart visualization
function transformData(data) {
  // Validate input
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Invalid data: expected non-empty array');
  }
  
  // Transform and validate each row
  const transformed = data.map(row => {
    const value = parseFloat(row['${metricCol}']);
    if (isNaN(value)) {
      console.warn('Skipping row with invalid value:', row);
      return null;
    }
    
    return {
      label: String(row['${dimensionCol}'] || 'Unknown'),
      value: value
    };
  }).filter(row => row !== null);
  
  // Sort by value descending
  return transformed.sort((a, b) => b.value - a.value);
}
    `.trim();
    
    chartConfig = {
      xAxis: 'label',
      yAxis: 'value',
      dataKey: 'value',
      metricColumn: metricCol,
      dimensionColumn: dimensionCol
    };
  } else {
    // Fallback for simple data
    pipelineCode = getMockResponse('pipeline').pipeline_code;
    chartConfig = getMockResponse('pipeline').chart_config;
  }
  
  return {
    pipeline_code: pipelineCode,
    chart_config: chartConfig
  };
}

/**
 * Execute pipeline code in sandboxed environment
 */
function executePipeline(pipelineCode, data) {
  try {
    // Create sandboxed VM
    const vm = new VM({
      timeout: 5000, // 5 second timeout
      sandbox: {
        console: {
          log: (...args) => console.log('[Pipeline]', ...args),
          warn: (...args) => console.warn('[Pipeline]', ...args),
          error: (...args) => console.error('[Pipeline]', ...args)
        }
      }
    });
    
    // Execute pipeline code
    const transformData = vm.run(`${pipelineCode}\ntransformData`);
    
    // Transform data
    const result = transformData(data);
    
    // Validate output
    if (!Array.isArray(result)) {
      throw new Error('Pipeline must return an array');
    }
    
    if (result.length > 0) {
      const firstItem = result[0];
      if (!firstItem.label || firstItem.value === undefined) {
        throw new Error('Pipeline output must have "label" and "value" properties');
      }
    }
    
    return result;
  } catch (error) {
    console.error('Pipeline execution error:', error);
    throw new Error(`Pipeline execution failed: ${error.message}`);
  }
}

/**
 * Load CSV data for a session
 */
async function loadSessionData(sessionId) {
  // Get session info
  const session = await new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM sessions WHERE id = ?',
      [sessionId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // For now, return mock data
  // TODO: Load actual CSV data from file
  return [
    { id: 1, name: 'Product A', value: 150, date: '2024-01-01', category: 'Electronics' },
    { id: 2, name: 'Product B', value: 230, date: '2024-01-02', category: 'Clothing' },
    { id: 3, name: 'Product C', value: 180, date: '2024-01-03', category: 'Electronics' },
    { id: 4, name: 'Product D', value: 95, date: '2024-01-04', category: 'Food' },
    { id: 5, name: 'Product E', value: 310, date: '2024-01-05', category: 'Electronics' },
    { id: 6, name: 'Product F', value: 125, date: '2024-01-06', category: 'Clothing' },
    { id: 7, name: 'Product G', value: 275, date: '2024-01-07', category: 'Food' },
    { id: 8, name: 'Product H', value: 190, date: '2024-01-08', category: 'Electronics' },
    { id: 9, name: 'Product I', value: 85, date: '2024-01-09', category: 'Clothing' },
    { id: 10, name: 'Product J', value: 420, date: '2024-01-10', category: 'Electronics' }
  ];
}

/**
 * POST /api/pipeline/:sessionId
 * Generate transformation pipeline for a session
 */
router.post('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log(`🔧 Generating pipeline for session: ${sessionId}`);
    
    // Get schema from database
    const schema = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM schemas WHERE session_id = ?',
        [sessionId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    if (!schema) {
      return res.status(404).json({ error: 'Schema not found' });
    }
    
    const parsedSchema = {
      columns: JSON.parse(schema.columns)
    };
    
    // Load sample data
    const sampleData = await loadSessionData(sessionId);
    
    // Generate pipeline using IBM Bob (or mock)
    const pipeline = await generatePipeline(parsedSchema, sampleData);
    console.log(`✅ Pipeline generated with ${pipeline.pipeline_code.length} characters`);
    
    // Execute pipeline to validate
    const transformedData = executePipeline(pipeline.pipeline_code, sampleData);
    console.log(`✅ Pipeline executed successfully, produced ${transformedData.length} rows`);
    
    // Save pipeline to database
    const pipelineId = randomUUID();
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO pipelines (id, session_id, code, chart_config, status) VALUES (?, ?, ?, ?, ?)',
        [
          pipelineId,
          sessionId,
          pipeline.pipeline_code,
          JSON.stringify(pipeline.chart_config),
          'active'
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    // Update session status
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE sessions SET status = ? WHERE id = ?',
        ['pipeline_generated', sessionId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    // Log to audit trail
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO audit_log (session_id, action, details) VALUES (?, ?, ?)',
        [
          sessionId,
          'pipeline_generated',
          JSON.stringify({
            pipeline_id: pipelineId,
            code_length: pipeline.pipeline_code.length,
            chart_type: 'bar',
            rows_transformed: transformedData.length
          })
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    console.log(`✅ Pipeline ${pipelineId} saved to database`);
    
    // Return response
    res.json({
      success: true,
      pipelineId,
      pipeline: {
        code: pipeline.pipeline_code,
        chartConfig: pipeline.chart_config
      },
      preview: transformedData.slice(0, 10) // Return first 10 rows as preview
    });
    
  } catch (error) {
    console.error('❌ Pipeline generation error:', error);
    res.status(500).json({
      error: 'Failed to generate pipeline',
      message: error.message
    });
  }
});

/**
 * GET /api/pipeline/:sessionId
 * Retrieve pipeline for a session
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Get pipeline from database
    const pipeline = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM pipelines WHERE session_id = ? AND status = ?',
        [sessionId, 'active'],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    if (!pipeline) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    
    res.json({
      success: true,
      pipeline: {
        id: pipeline.id,
        code: pipeline.code,
        chartConfig: JSON.parse(pipeline.chart_config),
        createdAt: pipeline.created_at
      }
    });
    
  } catch (error) {
    console.error('❌ Pipeline retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve pipeline',
      message: error.message
    });
  }
});

/**
 * GET /api/data/:sessionId
 * Get transformed data for visualization
 */
router.get('/data/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log(`📊 Loading data for session: ${sessionId}`);
    
    // Get pipeline
    const pipeline = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM pipelines WHERE session_id = ? AND status = ?',
        [sessionId, 'active'],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    if (!pipeline) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    
    // Load raw data
    const rawData = await loadSessionData(sessionId);
    
    // Execute pipeline
    const transformedData = executePipeline(pipeline.code, rawData);
    
    console.log(`✅ Data transformed: ${transformedData.length} rows`);
    
    res.json({
      success: true,
      data: transformedData,
      chartConfig: JSON.parse(pipeline.chart_config)
    });
    
  } catch (error) {
    console.error('❌ Data transformation error:', error);
    res.status(500).json({
      error: 'Failed to transform data',
      message: error.message
    });
  }
});

export default router;

// Made with Bob