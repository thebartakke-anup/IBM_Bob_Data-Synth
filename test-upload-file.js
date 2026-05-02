import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

async function testUpload() {
  try {
    const form = new FormData();
    const fileStream = fs.createReadStream('backend/uploads/test-simple.csv');
    form.append('file', fileStream, 'test-simple.csv');

    console.log('Uploading file to http://localhost:3001/api/upload...');
    
    const response = await axios.post('http://localhost:3001/api/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log('✅ Upload successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Upload failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testUpload();

// Made with Bob
