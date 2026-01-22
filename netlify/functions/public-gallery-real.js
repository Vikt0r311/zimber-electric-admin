const { getStore } = require("@netlify/blobs");

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
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    // Try to get data from Netlify Blobs first
    let galleries = [];
    try {
      const metaStore = getStore({
        name: "gallery-metadata", 
        siteID: process.env.NETLIFY_SITE_ID,
        token: process.env.NETLIFY_TOKEN,
      });
      const imagesStore = getStore({
        name: "gallery-images",
        siteID: process.env.NETLIFY_SITE_ID, 
        token: process.env.NETLIFY_TOKEN,
      });
      
      const foldersData = await metaStore.get("folders", { type: "json" }) || {};
      
      galleries = await Promise.all(
        Object.values(foldersData).map(async (folder) => {
          const { blobs } = await imagesStore.list({ prefix: `${folder.id}/` });
          
          const images = await Promise.all(
            blobs.slice(0, 20).map(async (blob) => {
              const url = await imagesStore.getPublicUrl(blob.key);
              return {
                name: blob.key.split('/').pop(),
                src: url,
                alt: `${folder.name} - ${blob.key.split('/').pop()}`
              };
            })
          );

          return {
            id: folder.id,
            name: folder.name,
            folder: folder.folder,
            imageCount: blobs.length,
            images
          };
        })
      );
    } catch (blobsError) {
      console.log('Using static galleries (Blobs not available)');
    }

    // If no Blobs data or error, use static galleries
    if (galleries.length === 0) {
      galleries = getStaticGalleries();
    }

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(galleries)
    };

  } catch (error) {
    console.error("Public gallery error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to load gallery" })
    };
  }
};

function getStaticGalleries() {
  return [
    {
      id: "tata-140m2-csaladi-haz",
      name: "Tata - 140m² Családi Ház", 
      folder: "tata-140m2-csaladi-haz",
      imageCount: 59,
      images: generateStaticImages("tata-140m2-csaladi-haz", 10) // Show first 10
    },
    {
      id: "komarom-64m2-panellakas",
      name: "Komárom - 64m² Panellakás",
      folder: "komarom-64m2-panellakas", 
      imageCount: 16,
      images: generateStaticImages("komarom-64m2-panellakas", 10)
    },
    {
      id: "almasfuzito-55m2-panellakas",
      name: "Almásfüzitő - 55m² Panellakás",
      folder: "almasfuzito_55m2_panellakas",
      imageCount: 26,
      images: generateStaticImages("almasfuzito_55m2_panellakas", 10)
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
}

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