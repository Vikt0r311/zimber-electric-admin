// Real public gallery function - updated $(date)
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

  try {
    if (method === "GET") {
      // Return real gallery folders with static images
      const realGalleries = [
        {
          id: "tata-140m2-csaladi-haz",
          name: "Tata - 140m² Családi Ház", 
          folder: "tata-140m2-csaladi-haz",
          imageCount: 58,
          images: generateStaticImages("tata-140m2-csaladi-haz", 58)
        },
        {
          id: "komarom-64m2-panellakas",
          name: "Komárom - 64m² Panellakás",
          folder: "komarom-64m2-panellakas", 
          imageCount: 16,
          images: generateStaticImages("komarom-64m2-panellakas", 16)
        },
        {
          id: "almasfuzito-55m2-panellakas",
          name: "Almásfüzitő - 55m² Panellakás",
          folder: "almasfuzito_55m2_panellakas",
          imageCount: 26,
          images: generateStaticImages("almasfuzito_55m2_panellakas", 26)
        },
        {
          id: "kiseloszto-csere",
          name: "Kiselosztó Csere",
          folder: "kiseloszto-csere",
          imageCount: 2,
          images: generateStaticImages("kiseloszto-csere", 2)
        },
        {
          id: "homlokzati-hoszigeteleshez-szerelvenyek",
          name: "Homlokzati Hőszigetelés Szerelvények", 
          folder: "homlokzati-hoszigeteleshez-szerelvenyek",
          imageCount: 6,
          images: generateStaticImages("homlokzati-hoszigeteleshez-szerelvenyek", 6)
        }
      ];

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(realGalleries)
      };
    }

    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };

  } catch (error) {
    console.error("Simple public gallery error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};

function generateStaticImages(folderName, count) {
  const images = [];
  for (let i = 1; i <= count; i++) {
    const paddedNum = String(i).padStart(2, '0');
    images.push({
      name: `Image${paddedNum}.webp`,
      src: `/galeria/${folderName}/Image${paddedNum}.webp`,
      alt: `${folderName} - Image${paddedNum}.webp`
    });
  }
  return images;
}