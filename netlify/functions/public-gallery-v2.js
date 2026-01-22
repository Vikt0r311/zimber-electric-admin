// Real public gallery function - updated $(date)
// Local cache for created folders (temporary solution for serverless functions)
let cachedFolders = [];

exports.handler = async (event, context) => {
  const method = event.httpMethod;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
      // Get dynamic folders from gallery-folders-v2
      let folders = [];
      try {
        const foldersResponse = await fetch(`${event.headers.origin || 'https://zimber-electric.hu'}/.netlify/functions/gallery-folders-v2`);
        folders = await foldersResponse.json();
      } catch (error) {
        console.log('Failed to get dynamic folders, using fallback', error);
        // Check if we got any data at all from the API call  
        if (!folders || folders.length === 0 || !Array.isArray(folders)) {
          console.log('No folders received from API, using fallback');
          // Fallback to static folders if API call fails
          folders = [
            {
              id: "tata-140m2-csaladi-haz",
              name: "Tata - 140m² Családi Ház", 
              folder: "tata-140m2-csaladi-haz",
              imageCount: 58
            },
            {
              id: "komarom-64m2-panellakas",
              name: "Komárom - 64m² Panellakás",
              folder: "komarom-64m2-panellakas", 
              imageCount: 16
            },
            {
              id: "almasfuzito-55m2-panellakas",
              name: "Almásfüzitő - 55m² Panellakás",
              folder: "almasfuzito_55m2_panellakas",
              imageCount: 26
            },
            {
              id: "kiseloszto-csere",
              name: "Kiselosztó Csere",
              folder: "kiseloszto-csere",
              imageCount: 2
            },
            {
              id: "homlokzati-hoszigeteleshez-szerelvenyek",
              name: "Homlokzati Hőszigetelés Szerelvények", 
              folder: "homlokzati-hoszigeteleshez-szerelvenyek",
              imageCount: 6
            }
          ];
        } else {
          console.log(`Successfully got ${folders.length} folders from API`);
        }
      }

      // Merge cached folders with API folders (avoid duplicates)
      const allFolders = [...folders];
      cachedFolders.forEach(cachedFolder => {
        if (!allFolders.find(f => f.id === cachedFolder.id)) {
          allFolders.push(cachedFolder);
        }
      });

      console.log(`Total folders (API + cached): ${allFolders.length}`);

      // Build galleries with images for each folder
      const realGalleries = await Promise.all(allFolders.map(async (folder) => {
        let images = [];
        try {
          // Get images for this folder from gallery-images-v2
          const imagesResponse = await fetch(`${event.headers.origin || 'https://zimber-electric.hu'}/.netlify/functions/gallery-images-v2?folder=${folder.id}`);
          const folderImages = await imagesResponse.json();
          
          images = folderImages.map(img => ({
            name: img.name,
            src: img.path,
            alt: `${folder.name} - ${img.name}`
          }));
        } catch (error) {
          console.log(`Failed to get images for ${folder.id}, using static fallback`);
          // Fallback to static images if API call fails
          const staticImageMaps = {
            'tata-140m2-csaladi-haz': generateStaticImages('tata-140m2-csaladi-haz', 58),
            'komarom-64m2-panellakas': generateStaticImages('komarom-64m2-panellakas', 16),
            'almasfuzito_55m2_panellakas': generateStaticImages('almasfuzito_55m2_panellakas', 26),
            'kiseloszto-csere': generateStaticImages('kiseloszto-csere', 2),
            'homlokzati-hoszigeteleshez-szerelvenyek': generateStaticImages('homlokzati-hoszigeteleshez-szerelvenyek', 6)
          };
          images = staticImageMaps[folder.id] || [];
        }

        return {
          id: folder.id,
          name: folder.name,
          folder: folder.folder,
          imageCount: images.length,
          images: images
        };
      }));

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(realGalleries)
      };
    }

    if (method === "POST") {
      // Handle folder cache updates from gallery-folders-v2
      try {
        const requestBody = JSON.parse(event.body || '{}');
        if (requestBody.action === 'add_folder' && requestBody.folder) {
          // Add folder to local cache if not already present
          if (!cachedFolders.find(f => f.id === requestBody.folder.id)) {
            cachedFolders.push(requestBody.folder);
            console.log(`Added folder to cache: ${requestBody.folder.id}`);
          }
        } else if (requestBody.action === 'remove_folder' && requestBody.folderId) {
          // Remove folder from local cache
          cachedFolders = cachedFolders.filter(f => f.id !== requestBody.folderId);
          console.log(`Removed folder from cache: ${requestBody.folderId}`);
        }
        
        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ success: true, message: "Cache updated" })
        };
      } catch (error) {
        console.error("Error updating cache:", error);
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Invalid request body" })
        };
      }
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