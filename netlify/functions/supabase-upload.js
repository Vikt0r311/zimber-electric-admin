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

    // Parse the base64 encoded body
    const body = event.body;
    const isBase64 = event.isBase64Encoded;
    
    if (!body) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No file data received" })
      };
    }

    // For multipart form data from browser, parse as binary
    let boundary = '';
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    const boundaryMatch = contentType.match(/boundary=([^;]+)/);
    if (boundaryMatch) {
      boundary = boundaryMatch[1];
    }

    let bodyBuffer;
    if (isBase64) {
      bodyBuffer = Buffer.from(body, 'base64');
    } else {
      bodyBuffer = Buffer.from(body, 'utf8');
    }

    // Simple multipart parsing
    const bodyString = bodyBuffer.toString();
    const parts = bodyString.split(`--${boundary}`);
    
    const uploadedImages = [];
    
    for (const part of parts) {
      if (part.includes('filename=')) {
        // Extract filename
        const filenameMatch = part.match(/filename="([^"]+)"/);
        if (!filenameMatch) continue;
        
        const originalFilename = filenameMatch[1];
        const timestamp = Date.now();
        const fileExtension = originalFilename.split('.').pop();
        const fileName = `uploaded-${timestamp}.${fileExtension}`;
        
        // Extract file content (everything after double CRLF)
        const contentStart = part.indexOf('\r\n\r\n');
        if (contentStart === -1) continue;
        
        const fileContent = part.substring(contentStart + 4);
        // Remove the trailing boundary
        const cleanContent = fileContent.replace(/\r\n$/, '');
        
        const filePath = `gallery/${folderId}/${fileName}`;
        
        // Determine content type
        let contentTypeToUse = 'image/jpeg';
        if (originalFilename.toLowerCase().endsWith('.png')) {
          contentTypeToUse = 'image/png';
        } else if (originalFilename.toLowerCase().endsWith('.webp')) {
          contentTypeToUse = 'image/webp';
        } else if (originalFilename.toLowerCase().endsWith('.gif')) {
          contentTypeToUse = 'image/gif';
        }
        
        const { data, error } = await supabase.storage
          .from('images')
          .upload(filePath, Buffer.from(cleanContent, 'binary'), {
            contentType: contentTypeToUse,
            upsert: true
          });

        if (error) {
          console.error('Supabase upload error:', error);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        uploadedImages.push({
          name: fileName,
          path: publicUrl,
          key: filePath,
          size: cleanContent.length,
          type: contentTypeToUse
        });

        console.log(`Successfully uploaded: ${filePath}`);
      }
    }

    if (uploadedImages.length === 0) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No valid images found in upload" })
      };
    }

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: `Successfully uploaded ${uploadedImages.length} image(s) to Supabase Storage!`,
        images: uploadedImages
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