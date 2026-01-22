// Upload images function v2 - with Netlify Blobs integration
const { getStore } = require('@netlify/blobs');

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

    // For now, return a simple mock response since multipart/form-data parsing is complex
    // The real implementation would parse multipart data and store in Blobs
    console.log(`Mock upload for folder: ${folderId}`);
    
    const timestamp = Date.now();
    const mockImageKey = `${folderId}/mock-${timestamp}.jpg`;
    const mockImage = {
      key: mockImageKey,
      name: `mock-image-${timestamp}.jpg`,
      path: `/.netlify/functions/gallery-image-v2?key=${encodeURIComponent(mockImageKey)}`,
      size: 123456,
      type: "image/jpeg"
    };

    // Get the gallery store
    const galleryStore = getStore('gallery-images');
    
    // Store a mock blob (empty buffer for now)
    const mockImageData = Buffer.from('mock-image-data');
    await galleryStore.set(mockImageKey, mockImageData, {
      metadata: {
        originalName: mockImage.name,
        folderId: folderId,
        uploadTime: new Date().toISOString(),
        contentType: mockImage.type
      }
    });

    console.log(`Stored mock image: ${mockImageKey}`);

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        success: true, 
        message: "Mock upload successful - Blobs integration working",
        uploaded: 1,
        images: [mockImage]
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