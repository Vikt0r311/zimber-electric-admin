import { getStore } from "@netlify/blobs";

// Public gallery data (for the main gallery page)
export default async (req, context) => {
  const method = req.method;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  if (method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }

  try {
    const metaStore = getStore("gallery-metadata");
    const imagesStore = getStore("gallery-images");
    
    // Get all folders
    const foldersData = await metaStore.get("folders", { type: "json" }) || {};
    
    // Get images for each folder
    const folders = await Promise.all(
      Object.values(foldersData).map(async (folder) => {
        const { blobs } = await imagesStore.list({ prefix: `${folder.id}/` });
        
        const images = await Promise.all(
          blobs.slice(0, 50).map(async (blob) => { // Limit to 50 images per folder for performance
            const url = await imagesStore.getPublicUrl(blob.key);
            const filename = blob.key.split('/').pop();
            
            return {
              name: filename,
              src: url,
              alt: `${folder.name} - ${filename}`
            };
          })
        );

        // Sort images by name (assuming they have numbered names like Image01.webp)
        images.sort((a, b) => {
          const aMatch = a.name.match(/(\d+)/);
          const bMatch = b.name.match(/(\d+)/);
          if (aMatch && bMatch) {
            return parseInt(aMatch[1]) - parseInt(bMatch[1]);
          }
          return a.name.localeCompare(b.name);
        });

        return {
          id: folder.id,
          name: folder.name,
          folder: folder.folder,
          imageCount: blobs.length,
          images
        };
      })
    );

    // Sort folders by creation date
    folders.sort((a, b) => {
      const aFolder = foldersData[a.id];
      const bFolder = foldersData[b.id];
      return new Date(bFolder.createdAt) - new Date(aFolder.createdAt);
    });

    return new Response(JSON.stringify(folders), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Public gallery error:", error);
    return new Response(JSON.stringify({ error: "Failed to load gallery" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }
};