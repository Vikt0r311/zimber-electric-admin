// Simple upload images function for troubleshooting
let mockImages = {}; // Store mock images per folder (shared with gallery-images-simple)

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

    // Initialize mock images array for this folder if it doesn't exist
    if (!mockImages[folderId]) {
      mockImages[folderId] = [];
    }

    // Create mock uploaded image
    const mockImage = {
      name: `mock-image-${Date.now()}.jpg`,
      path: `https://via.placeholder.com/300x200/1a1d29/00d9ff?text=Mock+Image+${mockImages[folderId].length + 1}`,
      size: 123456,
      type: "image/jpeg"
    };

    // Add to mock storage
    mockImages[folderId].push(mockImage);

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        success: true, 
        message: "Mock upload successful",
        uploaded: 1,
        images: [mockImage]
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