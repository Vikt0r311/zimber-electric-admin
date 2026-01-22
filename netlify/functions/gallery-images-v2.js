// Gallery images function v2 - serves real static images
let uploadedImages = {}; // Store uploaded images per folder

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

      // Generate static images for real folders
      const staticImageMaps = {
        'tata-140m2-csaladi-haz': generateImageList('tata-140m2-csaladi-haz', 58),
        'komarom-64m2-panellakas': generateImageList('komarom-64m2-panellakas', 16),
        'almasfuzito-55m2-panellakas': generateImageList('almasfuzito_55m2_panellakas', 26),
        'kiseloszto-csere': generateImageList('kiseloszto-csere', 2),
        'homlokzati-hoszigeteleshez-szerelvenyek': generateImageList('homlokzati-hoszigeteleshez-szerelvenyek', 6)
      };

      const staticImages = staticImageMaps[folderId] || [];
      const dynamicImages = uploadedImages[folderId] || [];
      const allImages = [...staticImages, ...dynamicImages];

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