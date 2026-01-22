const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const folderId = event.queryStringParameters?.folder;
    if (!folderId) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Folder ID is required" })
      };
    }

    console.log(`Upload request for folder: ${folderId}`);
    console.log(`Content-Type: ${event.headers['content-type']}`);
    console.log(`Body length: ${event.body ? event.body.length : 0}`);
    console.log(`Is Base64: ${event.isBase64Encoded}`);

    // Get the raw body
    const body = event.body;
    if (!body) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No file data received" })
      };
    }

    // Convert body to buffer
    let bodyBuffer;
    if (event.isBase64Encoded) {
      bodyBuffer = Buffer.from(body, 'base64');
    } else {
      bodyBuffer = Buffer.from(body, 'utf8');
    }

    console.log(`Buffer length: ${bodyBuffer.length}`);

    // Simple approach: create a test file first to verify connection
    const timestamp = Date.now();
    const testFileName = `test-${timestamp}.txt`;
    const testFilePath = `gallery/${folderId}/${testFileName}`;
    
    const { data: testData, error: testError } = await supabase.storage
      .from('images')
      .upload(testFilePath, 'Connection test successful', {
        contentType: 'text/plain',
        upsert: true
      });

    if (testError) {
      console.error('Supabase connection test failed:', testError);
      return {
        statusCode: 500,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Supabase connection failed: ${testError.message}` })
      };
    }

    console.log('Supabase connection test successful');

    // Now try to upload the actual image
    const imageFileName = `image-${timestamp}.jpg`;
    const imageFilePath = `gallery/${folderId}/${imageFileName}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(imageFilePath, bodyBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Image upload error:', error);
      return {
        statusCode: 500,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Image upload failed: ${error.message}` })
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(imageFilePath);

    console.log(`Successfully uploaded: ${imageFilePath} -> ${publicUrl}`);

    // Clean up test file
    await supabase.storage.from('images').remove([testFilePath]);

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Upload successful to Supabase Storage!",
        images: [{
          name: imageFileName,
          path: publicUrl,
          key: imageFilePath,
          size: bodyBuffer.length,
          type: "image/jpeg"
        }]
      })
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: `Server error: ${error.message}` })
    };
  }
};