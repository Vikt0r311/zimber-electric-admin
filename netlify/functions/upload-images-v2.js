// Upload images function v2 - simple implementation without multiparty
exports.handler = async (event, context) => {
  const method = event.httpMethod;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers
    };
  }

  if (method !== "POST") {
    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
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

    // Simple mock upload response - in production this would be implemented with proper file handling
    const timestamp = Date.now();
    const uploadedImages = [
      {
        key: `${folderId}/uploaded-${timestamp}.jpg`,
        name: `uploaded-image-${timestamp}.jpg`,
        size: 123456,
        type: "image/jpeg"
      }
    ];

    // Notify gallery-images-v2 about the uploaded images
    try {
      await fetch(`${event.headers.origin || 'https://zimber-electric.hu'}/.netlify/functions/gallery-images-v2?folder=${folderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: uploadedImages })
      });
    } catch (notifyError) {
      console.log('Failed to notify gallery-images about upload:', notifyError);
    }

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        success: true, 
        message: "Upload successful (mock implementation)",
        uploaded: uploadedImages.length,
        images: uploadedImages
      })
    };

  } catch (error) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};