import express from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { randomUUID } from 'crypto';
import db from '../db/init.js';
import { isIBMConfigured, getMockResponse } from '../services/ibmService.js';

const router = express.Router();

// Configure multer for file uploads
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * Parse CSV file and extract first N rows for analysis
 */
function parseCSV(filePath, maxRows = 100) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const headers = [];
    
    createReadStream(filePath)
      .pipe(csvParser())
      .on('headers', (headerList) => {
        headers.push(...headerList);
      })
      .on('data', (row) => {
        if (rows.length < maxRows) {
          rows.push(row);
        }
      })
      .on('end', () => {
        resolve({ headers, rows, totalRows: rows.length });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Analyze CSV data and detect schema using IBM Bob or mock
 */
async function detectSchema(headers, sampleRows) {
  // For now, use mock response
  // TODO: Integrate real IBM Bob SDK when credentials are available
  
  if (isIBMConfigured()) {
    // Real IBM Bob integration would go here
    console.log('Using IBM Bob for schema detection...');
    // const result = await callIBMBob(headers, sampleRows);
    // return result;
  }
  
  // Use mock response for development
  console.log('Using mock schema detection...');
  
  // Analyze sample data to infer types
  const columns = headers.map(header => {
    const sampleValues = sampleRows.slice(0, 10).map(row => row[header]);
    
    // Infer type based on sample values
    let type = 'string';
    let semantic = 'dimension';
    let confidence = 0.85;
    
    // Check if numeric
    const numericValues = sampleValues.filter(v => !isNaN(parseFloat(v)));
    if (numericValues.length > sampleValues.length * 0.8) {
      type = 'number';
      semantic = 'metric';
      confidence = 0.90;
    }
    
    // Check if date
    const dateValues = sampleValues.filter(v => !isNaN(Date.parse(v)));
    if (dateValues.length > sampleValues.length * 0.8) {
      type = 'date';
      semantic = 'time';
      confidence = 0.88;
    }
    
    // Check for ID patterns
    if (header.toLowerCase().includes('id')) {
      semantic = 'dimension';
      confidence = 0.95;
    }
    
    return {
      name: header,
      type,
      semantic,
      confidence
    };
  });
  
  // Generate assumptions based on detected schema
  const assumptions = [];
  
  const idColumns = columns.filter(c => c.name.toLowerCase().includes('id'));
  if (idColumns.length > 0) {
    assumptions.push(`Detected ${idColumns.length} ID column(s) as primary dimension(s)`);
  }
  
  const metricColumns = columns.filter(c => c.semantic === 'metric');
  if (metricColumns.length > 0) {
    assumptions.push(`Identified ${metricColumns.length} numeric column(s) as metric(s)`);
  }
  
  const timeColumns = columns.filter(c => c.semantic === 'time');
  if (timeColumns.length > 0) {
    assumptions.push(`Found ${timeColumns.length} date/time column(s)`);
  }
  
  assumptions.push(`Total of ${columns.length} columns detected with average confidence of ${(columns.reduce((sum, c) => sum + c.confidence, 0) / columns.length * 100).toFixed(1)}%`);
  
  return {
    columns,
    assumptions
  };
}

/**
 * POST /api/upload
 * Upload CSV file and detect schema
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const sessionId = randomUUID();
    const filename = req.file.originalname;
    const filePath = req.file.path;
    
    console.log(`📁 Processing file: ${filename} (Session: ${sessionId})`);
    
    // Parse CSV file
    const { headers, rows, totalRows } = await parseCSV(filePath);
    console.log(`✅ Parsed ${totalRows} rows with ${headers.length} columns`);
    
    // Detect schema using IBM Bob (or mock)
    const schema = await detectSchema(headers, rows);
    console.log(`✅ Schema detected with ${schema.columns.length} columns`);
    
    // Save session to database
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO sessions (id, filename, status) VALUES (?, ?, ?)',
        [sessionId, filename, 'schema_detected'],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    // Save schema to database
    const schemaId = randomUUID();
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO schemas (id, session_id, columns, confidence_scores) VALUES (?, ?, ?, ?)',
        [
          schemaId,
          sessionId,
          JSON.stringify(schema.columns),
          JSON.stringify(schema.columns.map(c => ({ name: c.name, confidence: c.confidence })))
        ],
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
          'csv_uploaded',
          JSON.stringify({
            filename,
            rows: totalRows,
            columns: headers.length,
            schema_detected: true
          })
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    console.log(`✅ Session ${sessionId} saved to database`);
    
    // Return response
    res.json({
      success: true,
      sessionId,
      filename,
      rowCount: totalRows,
      schema: {
        id: schemaId,
        columns: schema.columns,
        assumptions: schema.assumptions
      }
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      error: 'Failed to process file',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/:sessionId
 * Retrieve schema for a session
 */
router.get('/schema/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
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
    
    res.json({
      success: true,
      sessionId,
      filename: session.filename,
      schema: {
        id: schema.id,
        columns: JSON.parse(schema.columns),
        confidenceScores: JSON.parse(schema.confidence_scores)
      }
    });
    
  } catch (error) {
    console.error('❌ Schema retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve schema',
      message: error.message
    });
  }
});

export default router;

// Made with Bob