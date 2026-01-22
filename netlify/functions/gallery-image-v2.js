// Gallery image serving function v2 - serves images from Blobs
const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  const method = event.httpMethod;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers
    };
  }

  if (method !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: "Method not allowed"
    };
  }

  try {
    // Get image key from URL parameters
    const key = event.queryStringParameters?.key;
    
    if (!key) {
      return {
        statusCode: 400,
        headers,
        body: "Missing image key"
      };
    }

    // Get the gallery store
    const galleryStore = getStore('gallery-images');

    // Get the image as stream
    const imageBlob = await galleryStore.get(key, { type: "stream" });

    if (!imageBlob) {
      return {
        statusCode: 404,
        headers,
        body: "Image not found"
      };
    }

    // Get metadata to determine content type
    let contentType = "image/jpeg";
    try {
      const metadata = await galleryStore.getMetadata(key);
      contentType = metadata?.contentType || "image/jpeg";
    } catch (error) {
      console.log('Could not get metadata for key:', key);
    }

    // Return the image
    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000" // Cache for 1 year
      },
      body: imageBlob,
      isBase64Encoded: false
    };

  } catch (error) {
    console.error("Image serving error:", error);
    return {
      statusCode: 500,
      headers,
      body: "Internal server error"
    };
  }
};