const { getStore } = require("@netlify/blobs");

// Gallery folders (mappa metaadatok kezelése)
exports.handler = async (event, context) => {
  const req = {
    method: event.httpMethod,
    json: () => JSON.parse(event.body || '{}')
  };
  const method = req.method;
  const metaStore = getStore("gallery-metadata");

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
      const imagesStore = getStore("gallery-images");
      
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
      const { name, folder: folderId } = await req.json();
      
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