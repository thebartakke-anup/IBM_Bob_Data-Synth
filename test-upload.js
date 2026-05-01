import { readFileSync } from 'fs';
import axios from 'axios';
import FormData from 'form-data';

async function testUpload() {
  try {
    console.log('Testing CSV upload endpoint...\n');
    
    // Read the sample CSV file
    const fileContent = readFileSync('./backend/uploads/sample-data.csv');
    
    // Create form data
    const formData = new FormData();
    formData.append('file', fileContent, {
      filename: 'sample-data.csv',
      contentType: 'text/csv'
    });
    
    // Upload the file
    console.log('Uploading file to http://localhost:3001/api/upload');
    const response = await axios.post('http://localhost:3001/api/upload', formData, {
      headers: formData.getHeaders()
    });
    
    console.log('\n✅ Upload successful!\n');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Test schema retrieval
    const sessionId = response.data.sessionId;
    console.log(`\n\nTesting schema retrieval for session: ${sessionId}`);
    
    const schemaResponse = await axios.get(`http://localhost:3001/api/schema/${sessionId}`);
    console.log('\n✅ Schema retrieval successful!\n');
    console.log('Schema:', JSON.stringify(schemaResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testUpload();

// Made with Bob
