// Simple upload images function for troubleshooting
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
    // Get folder ID from query params
    const folderId = event.queryStringParameters?.folder;
    
    if (!folderId) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Folder ID is required" })
      };
    }

    // For now, just return success response (mock upload)
    // In real implementation, this would process the multipart form data
    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        success: true, 
        message: "Mock upload successful",
        uploaded: 1,
        images: [
          {
            key: `${folderId}/mock-image.jpg`,
            name: "mock-image.jpg",
            size: 123456,
            type: "image/jpeg"
          }
        ]
      })
    };

  } catch (error) {
    console.error("Simple upload images error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};