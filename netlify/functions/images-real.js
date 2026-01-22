// Simple image listing for real uploaded files
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const folderId = event.queryStringParameters?.folder;
    if (!folderId) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Folder ID required" })
      };
    }

    // Static images for existing folders
    const staticImages = {
      'tata-140m2-csaladi-haz': generateStaticImages('tata-140m2-csaladi-haz', 58),
      'komarom-64m2-panellakas': generateStaticImages('komarom-64m2-panellakas', 16),
      'almasfuzito-55m2-panellakas': generateStaticImages('almasfuzito_55m2_panellakas', 26),
      'kiseloszto-csere': generateStaticImages('kiseloszto-csere', 2),
      'homlokzati-hoszigeteleshez-szerelvenyek': generateStaticImages('homlokzati-hoszigeteleshez-szerelvenyek', 6)
    };

    let allImages = staticImages[folderId] || [];

    // Try to get uploaded images from /tmp/galeria
    try {
      const folderPath = path.join('/tmp/galeria', folderId);
      const files = await fs.readdir(folderPath);
      
      const uploadedImages = files
        .filter(file => file.match(/\.(jpg|jpeg|png|webp|gif)$/i))
        .map(file => ({
          name: file,
          path: `/galeria/${folderId}/${file}`,
          uploaded: true
        }));

      allImages = [...allImages, ...uploadedImages];
      console.log(`Found ${uploadedImages.length} uploaded images in ${folderId}`);
      
    } catch (error) {
      console.log(`No uploaded images in ${folderId}:`, error.message);
    }

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(allImages)
    };

  } catch (error) {
    console.error('Images list error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to list images" })
    };
  }
};

function generateStaticImages(folderName, count) {
  const images = [];
  for (let i = 1; i <= count; i++) {
    const paddedNum = String(i).padStart(2, '0');
    images.push({
      name: `Image${paddedNum}.webp`,
      path: `/galeria/${folderName}/Image${paddedNum}.webp`,
      static: true
    });
  }
  return images;
}