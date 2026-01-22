// Gallery images function v2 - serves real static images with Blobs integration
const { getStore } = require('@netlify/blobs');

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
      const folderId = event.queryStringParameters?.folder;
      
      if (!folderId) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Folder ID is required" })
        };
      }

      // Get the gallery store
      const galleryStore = getStore('gallery-images');
      console.log(`Listing blobs for folder: ${folderId}`);

      // Generate static images for real folders
      const staticImageMaps = {
        'tata-140m2-csaladi-haz': generateImageList('tata-140m2-csaladi-haz', 58),
        'komarom-64m2-panellakas': generateImageList('komarom-64m2-panellakas', 16),
        'almasfuzito-55m2-panellakas': generateImageList('almasfuzito_55m2_panellakas', 26),
        'kiseloszto-csere': generateImageList('kiseloszto-csere', 2),
        'homlokzati-hoszigeteleshez-szerelvenyek': generateImageList('homlokzati-hoszigeteleshez-szerelvenyek', 6)
      };

      const staticImages = staticImageMaps[folderId] || [];

      // Get images from Blobs store
      let blobImages = [];
      try {
        const { blobs } = await galleryStore.list({ prefix: `${folderId}/` });
        console.log(`Found ${blobs.length} blobs for folder ${folderId}`);
        
        blobImages = blobs.map(blob => ({
          name: blob.metadata?.originalName || blob.key.split('/').pop(),
          path: `/.netlify/functions/gallery-image-v2?key=${encodeURIComponent(blob.key)}`,
          key: blob.key
        }));
      } catch (error) {
        console.error('Error fetching blobs:', error);
      }

      const allImages = [...staticImages, ...blobImages];

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(allImages)
      };
    }

    if (method === "POST") {
      // Add uploaded image to folder
      const folderId = event.queryStringParameters?.folder;
      const requestBody = JSON.parse(event.body || '{}');
      
      if (!folderId) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Folder ID is required" })
        };
      }

      if (!uploadedImages[folderId]) {
        uploadedImages[folderId] = [];
      }

      // Add the uploaded image
      if (requestBody.images && Array.isArray(requestBody.images)) {
        uploadedImages[folderId].push(...requestBody.images.map(img => ({
          name: img.name,
          path: `/uploads/${folderId}/${img.name}`
        })));
      }

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, message: "Images added to folder" })
      };
    }

    if (method === "DELETE") {
      const folderId = event.queryStringParameters?.folder;
      const imageName = event.queryStringParameters?.image;
      
      if (!folderId || !imageName) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Folder ID and image name are required" })
        };
      }

      // Remove the image from uploadedImages
      if (uploadedImages[folderId]) {
        uploadedImages[folderId] = uploadedImages[folderId].filter(img => img.name !== imageName);
        if (uploadedImages[folderId].length === 0) {
          delete uploadedImages[folderId];
        }
      }

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, message: "Image deleted successfully" })
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
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};

function generateImageList(folderName, count) {
  const images = [];
  for (let i = 1; i <= count; i++) {
    const paddedNum = String(i).padStart(2, '0');
    images.push({
      name: `Image${paddedNum}.webp`,
      path: `/galeria/${folderName}/Image${paddedNum}.webp`
    });
  }
  return images;
}