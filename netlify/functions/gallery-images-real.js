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
        
        // Fallback: serve from static files if they exist
        const staticImages = getStaticImagesForFolder(folderId);
        
        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(staticImages)
        };
      }
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

function getStaticImagesForFolder(folderId) {
  // Map folder IDs to static image paths
  const staticImageMaps = {
    'tata-140m2-csaladi-haz': generateImageList('tata-140m2-csaladi-haz', 59),
    'komarom-64m2-panellakas': generateImageList('komarom-64m2-panellakas', 16),
    'almasfuzito-55m2-panellakas': generateImageList('almasfuzito_55m2_panellakas', 26),
    'kiseloszto-csere': generateImageList('kiseloszto-csere', 2),
    'homlokzati-hoszigeteleshez-szerelvenyek': generateImageList('homlokzati-hoszigeteleshez-szerelvenyek', 6)
  };

  return staticImageMaps[folderId] || [];
}

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