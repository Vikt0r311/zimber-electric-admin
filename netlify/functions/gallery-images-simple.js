// Simple gallery images function for troubleshooting
let mockImages = {}; // Store mock images per folder

exports.handler = async (event, context) => {
  const method = event.httpMethod;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    if (method === "GET") {
      // Parse folder ID from query params - use event.queryStringParameters
      const folderId = event.queryStringParameters?.folder;
      
      if (!folderId) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Folder ID is required" })
        };
      }

      // Generate some mock images for demo
      const imageCount = Math.floor(Math.random() * 3) + 1; // 1-3 images
      const folderImages = Array.from({length: imageCount}, (_, i) => ({
        name: `mock-image-${i + 1}.jpg`,
        path: `https://via.placeholder.com/400x300/1a1d29/00d9ff?text=Mock+Image+${i + 1}`
      }));

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(folderImages)
      };
    }

    if (method === "DELETE") {
      // Mock delete response
      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, message: "Mock image deleted" })
      };
    }

    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };

  } catch (error) {
    console.error("Simple gallery images error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};