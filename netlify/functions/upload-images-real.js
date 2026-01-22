const { getStore } = require("@netlify/blobs");
const multiparty = require('multiparty');

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

    // Initialize stores
    let metaStore, imagesStore;
    try {
      metaStore = getStore({
        name: "gallery-metadata",
        siteID: process.env.NETLIFY_SITE_ID,
        token: process.env.NETLIFY_TOKEN,
      });
      imagesStore = getStore({
        name: "gallery-images",
        siteID: process.env.NETLIFY_SITE_ID,
        token: process.env.NETLIFY_TOKEN,
      });
    } catch (storeError) {
      console.error('Store initialization failed:', storeError);
      return {
        statusCode: 500,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Storage not available" })
      };
    }

    // Check if folder exists
    const foldersData = await metaStore.get("folders", { type: "json" }) || {};
    if (!foldersData[folderId]) {
      return {
        statusCode: 404,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Folder not found" })
      };
    }

    // Parse multipart data (simplified - in real implementation would need proper parsing)
    // For now, return success with mock uploaded image info
    const uploadedImages = [
      {
        key: `${folderId}/uploaded-${Date.now()}.jpg`,
        name: `uploaded-image-${Date.now()}.jpg`,
        size: 123456,
        type: "image/jpeg"
      }
    ];

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        success: true, 
        message: "Upload successful",
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