import { getStore } from "@netlify/blobs";

// Gallery folders (mappa metaadatok kezelése)
export default async (req, context) => {
  const method = req.method;
  const metaStore = getStore("gallery-metadata");

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
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

      return new Response(JSON.stringify(folders), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    if (method === "POST") {
      // Create new folder
      const { name, folder: folderId } = await req.json();
      
      if (!name || !folderId) {
        return new Response(JSON.stringify({ error: "Name and folder ID are required" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }

      const foldersData = await metaStore.get("folders", { type: "json" }) || {};
      
      if (foldersData[folderId]) {
        return new Response(JSON.stringify({ error: "Folder already exists" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }

      foldersData[folderId] = {
        id: folderId,
        name: name.trim(),
        folder: folderId,
        createdAt: new Date().toISOString()
      };

      await metaStore.set("folders", foldersData);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...headers, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Gallery folders error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }
};