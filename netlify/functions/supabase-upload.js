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

    // Get the body as buffer
    let bodyBuffer;
    if (event.isBase64Encoded) {
      bodyBuffer = Buffer.from(event.body, 'base64');
    } else {
      bodyBuffer = Buffer.from(event.body, 'binary');
    }

    console.log(`Body buffer length: ${bodyBuffer.length}`);
    console.log(`Content-Type: ${event.headers['content-type'] || event.headers['Content-Type']}`);

    // Parse multipart boundary
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    const boundaryMatch = contentType.match(/boundary=([^;,\s]+)/);
    
    if (!boundaryMatch) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No boundary found in Content-Type" })
      };
    }

    const boundary = boundaryMatch[1];
    console.log(`Boundary: ${boundary}`);

    // Convert to string for parsing headers, but keep track of byte positions
    const bodyString = bodyBuffer.toString('binary');
    const parts = bodyString.split(`--${boundary}`);

    console.log(`Found ${parts.length} parts`);

    const uploadedImages = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (!part.includes('Content-Disposition') || !part.includes('filename=')) {
        continue;
      }

      console.log(`Processing part ${i}...`);

      // Extract filename
      const filenameMatch = part.match(/filename="([^"]+)"/);
      if (!filenameMatch) {
        console.log('No filename found in part');
        continue;
      }

      const originalFilename = filenameMatch[1];
      console.log(`Original filename: ${originalFilename}`);

      // Find the end of headers (double CRLF)
      const headerEndIndex = part.indexOf('\r\n\r\n');
      if (headerEndIndex === -1) {
        console.log('No header end found');
        continue;
      }

      // Calculate the actual byte position in the original buffer
      const partStartInBuffer = bodyString.indexOf(part);
      const fileDataStartInBuffer = partStartInBuffer + headerEndIndex + 4;
      
      // Find the end of this part (next boundary or end)
      const nextBoundaryIndex = bodyString.indexOf(`--${boundary}`, partStartInBuffer + part.length);
      let fileDataEndInBuffer;
      
      if (nextBoundaryIndex === -1) {
        // Last part
        fileDataEndInBuffer = bodyBuffer.length - 4; // Remove trailing CRLF--
      } else {
        fileDataEndInBuffer = nextBoundaryIndex - 2; // Remove CRLF before boundary
      }

      // Extract the actual file data as binary
      const fileData = bodyBuffer.slice(fileDataStartInBuffer, fileDataEndInBuffer);
      
      console.log(`Extracted file data: ${fileData.length} bytes`);

      if (fileData.length === 0) {
        console.log('No file data found');
        continue;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = originalFilename.split('.').pop().toLowerCase();
      const fileName = `image-${timestamp}.${fileExtension}`;
      const filePath = `gallery/${folderId}/${fileName}`;

      // Determine content type
      let contentTypeToUse = 'image/jpeg';
      if (fileExtension === 'png') {
        contentTypeToUse = 'image/png';
      } else if (fileExtension === 'webp') {
        contentTypeToUse = 'image/webp';
      } else if (fileExtension === 'gif') {
        contentTypeToUse = 'image/gif';
      }

      console.log(`Uploading ${originalFilename} as ${fileName} (${fileData.length} bytes, ${contentTypeToUse})`);

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, fileData, {
          contentType: contentTypeToUse,
          upsert: true
        });

      if (error) {
        console.error(`Upload error for ${fileName}:`, error);
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
        size: fileData.length,
        type: contentTypeToUse
      });

      console.log(`Successfully uploaded: ${filePath} -> ${publicUrl}`);
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
        message: `Successfully uploaded ${uploadedImages.length} image(s)!`,
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