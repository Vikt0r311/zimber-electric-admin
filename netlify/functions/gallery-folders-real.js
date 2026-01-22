const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  const method = event.httpMethod;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    // Initialize stores
    let metaStore;
    try {
      metaStore = getStore({
        name: "gallery-metadata",
        siteID: process.env.NETLIFY_SITE_ID,
        token: process.env.NETLIFY_TOKEN,
      });
    } catch (storeError) {
      console.error('Store initialization failed:', storeError);
      
      // Fallback: return static folders if Blobs not available
      if (method === "GET") {
        const staticFolders = getStaticFolders();
        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(staticFolders)
        };
      }
      
      return {
        statusCode: 500,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Storage not available" })
      };
    }

    if (method === "GET") {
      try {
        const foldersData = await metaStore.get("folders", { type: "json" }) || {};
        const folders = Object.values(foldersData);
        
        // If no Blobs data, return static folders
        if (folders.length === 0) {
          const staticFolders = getStaticFolders();
          return {
            statusCode: 200,
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(staticFolders)
          };
        }

        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(folders)
        };
      } catch (blobsError) {
        console.error('Blobs error:', blobsError);
        
        // Fallback to static folders
        const staticFolders = getStaticFolders();
        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(staticFolders)
        };
      }
    }

    if (method === "POST") {
      const requestBody = JSON.parse(event.body || '{}');
      const { name, folder } = requestBody;

      if (!name || !folder) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Name and folder are required" })
        };
      }

      try {
        // Get existing folders
        const foldersData = await metaStore.get("folders", { type: "json" }) || {};
        
        // Add new folder
        const newFolder = {
          id: folder,
          name: name,
          folder: folder,
          imageCount: 0
        };
        
        foldersData[folder] = newFolder;
        
        // Save back to store
        await metaStore.set("folders", JSON.stringify(foldersData));

        return {
          statusCode: 201,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ success: true, folder: newFolder })
        };
      } catch (blobsError) {
        console.error('Blobs error:', blobsError);
        return {
          statusCode: 500,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Failed to create folder" })
        };
      }
    }

    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };

  } catch (error) {
    console.error("Gallery folders error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};

function getStaticFolders() {
  return [
    {
      id: "tata-140m2-csaladi-haz",
      name: "Tata - 140m² Családi Ház", 
      folder: "tata-140m2-csaladi-haz",
      imageCount: 59
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
}