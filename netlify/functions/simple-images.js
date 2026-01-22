// Ultra-simple image listing that just returns static images
exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    const folderId = event.queryStringParameters?.folder;
    if (!folderId) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Folder required" })
      };
    }

    console.log(`Getting images for folder: ${folderId}`);

    // Just return static images that we know exist
    let images = [];
    
    if (folderId === 'tata-140m2-csaladi-haz') {
      images = generateImages('tata-140m2-csaladi-haz', 58);
    } else if (folderId === 'komarom-64m2-panellakas') {
      images = generateImages('komarom-64m2-panellakas', 16);
    } else if (folderId === 'almasfuzito-55m2-panellakas') {
      images = generateImages('almasfuzito_55m2_panellakas', 26);
    } else if (folderId === 'kiseloszto-csere') {
      images = generateImages('kiseloszto-csere', 2);
    } else if (folderId === 'homlokzati-hoszigeteleshez-szerelvenyek') {
      images = generateImages('homlokzati-hoszigeteleshez-szerelvenyek', 6);
    } else {
      // For new folders, show one demo image
      images = [{
        name: `demo-image.webp`,
        path: `/galeria/tata-140m2-csaladi-haz/Image01.webp`, // Use existing image
        demo: true
      }];
    }

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(images)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message })
    };
  }
};

function generateImages(folderName, count) {
  const images = [];
  for (let i = 1; i <= count; i++) {
    const num = String(i).padStart(2, '0');
    images.push({
      name: `Image${num}.webp`,
      path: `/galeria/${folderName}/Image${num}.webp`
    });
  }
  return images;
}