import { getStore } from "@netlify/blobs";

// Single folder operations (update, delete)
export default async (req, context) => {
  const method = req.method;
  // Get folderId from URL path or headers
  const urlPath = new URL(req.url).pathname;
  const pathSegments = urlPath.split('/');
  const folderId = pathSegments[pathSegments.length - 1] || 
                   req.headers['x-folder-id'] || 
                   context.params?.folderId;
  
  if (!folderId) {
    return new Response(JSON.stringify({ error: "Folder ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const metaStore = getStore("gallery-metadata");
  const imagesStore = getStore("gallery-images");

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
    if (method === "PUT") {
      // Update folder name
      const { name } = await req.json();
      
      if (!name || !name.trim()) {
        return new Response(JSON.stringify({ error: "Name is required" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }

      const foldersData = await metaStore.get("folders", { type: "json" }) || {};
      
      if (!foldersData[folderId]) {
        return new Response(JSON.stringify({ error: "Folder not found" }), {
          status: 404,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }

      foldersData[folderId].name = name.trim();
      await metaStore.set("folders", foldersData);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    if (method === "DELETE") {
      // Delete folder and all its images
      const foldersData = await metaStore.get("folders", { type: "json" }) || {};
      
      if (!foldersData[folderId]) {
        return new Response(JSON.stringify({ error: "Folder not found" }), {
          status: 404,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }

      // Delete all images in the folder
      const { blobs } = await imagesStore.list({ prefix: `${folderId}/` });
      await Promise.all(blobs.map(blob => imagesStore.delete(blob.key)));

      // Remove folder from metadata
      delete foldersData[folderId];
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
    console.error("Gallery folder error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }
};