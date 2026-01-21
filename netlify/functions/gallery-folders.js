const { getStore } = require("@netlify/blobs");

// Gallery folders (mappa metaadatok kezelése)
exports.handler = async (event, context) => {
  const method = event.httpMethod;
  
  let metaStore, imagesStore;
  try {
    metaStore = getStore({
      name: "gallery-metadata",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_TOKEN,
    });
    imagesStore = getStore({
      name: "gallery-images",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_TOKEN,
    });
  } catch (error) {
    console.error('Error initializing stores:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Store initialization failed" })
    };
  }

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
    if (method === "GET") {
      // Get all folders with metadata
      const foldersData = await metaStore.get("folders", { type: "json" }) || {};
      
      // Count images for each folder
      const folders = await Promise.all(
        Object.values(foldersData).map(async (folder) => {
          const { blobs } = await imagesStore.list({ prefix: `${folder.id}/` });
          return {
            ...folder,
            imageCount: blobs.length
          };
        })
      );

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(folders)
      };
    }

    if (method === "POST") {
      // Create new folder
      const { name, folder: folderId } = JSON.parse(event.body || '{}');
      
      if (!name || !folderId) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Name and folder ID are required" })
        };
      }

      const foldersData = await metaStore.get("folders", { type: "json" }) || {};
      
      if (foldersData[folderId]) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Folder already exists" })
        };
      }

      foldersData[folderId] = {
        id: folderId,
        name: name.trim(),
        folder: folderId,
        createdAt: new Date().toISOString()
      };

      await metaStore.set("folders", foldersData);

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ success: true })
      };
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