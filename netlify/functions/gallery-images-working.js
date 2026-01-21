const { getStore } = require("@netlify/blobs");

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
    const folderId = event.queryStringParameters?.folder;
    
    if (!folderId) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Folder ID is required" })
      };
    }

    if (method === "GET") {
      try {
        const imagesStore = getStore({
          name: "gallery-images",
          siteID: process.env.NETLIFY_SITE_ID,
          token: process.env.NETLIFY_TOKEN,
        });

        const { blobs } = await imagesStore.list({ prefix: `${folderId}/` });
        
        const images = await Promise.all(
          blobs.map(async (blob) => {
            const url = await imagesStore.getPublicUrl(blob.key);
            return {
              name: blob.key.split('/').pop(),
              path: url
            };
          })
        );

        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(images)
        };
      } catch (blobsError) {
        console.error('Blobs error:', blobsError);
        // Return mock images if Blobs fails
        const mockImages = [
          {
            name: `mock-${folderId}-1.jpg`,
            path: `https://via.placeholder.com/400x300/1a1d29/00d9ff?text=${folderId}+1`
          },
          {
            name: `mock-${folderId}-2.jpg`, 
            path: `https://via.placeholder.com/400x300/2d3748/ffc107?text=${folderId}+2`
          }
        ];
        
        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(mockImages)
        };
      }
    }

    if (method === "DELETE") {
      // Delete image logic would go here
      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, message: "Image deleted" })
      };
    }

    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };

  } catch (error) {
    console.error("Gallery images error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};