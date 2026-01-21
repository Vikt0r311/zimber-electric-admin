import { getStore } from "@netlify/blobs";

// Get images for a folder
export default async (req, context) => {
  const method = req.method;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    const folderId = context.params.folderId;
    
    if (!folderId) {
      return new Response(JSON.stringify({ error: "Folder ID is required" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    const imagesStore = getStore("gallery-images");

    if (method === "GET") {
      // Get all images in folder
      const { blobs } = await imagesStore.list({ prefix: `${folderId}/` });
      
      const images = await Promise.all(
        blobs.map(async (blob) => {
          // Get the blob URL for public access
          const url = await imagesStore.getPublicUrl(blob.key);
          return {
            key: blob.key,
            name: blob.key.split('/').pop(), // Get filename from key
            path: url,
            size: blob.size,
            uploadedAt: blob.uploadedAt
          };
        })
      );

      return new Response(JSON.stringify(images), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    if (method === "DELETE") {
      // Delete specific image
      const { imageKey } = await req.json();
      
      if (!imageKey) {
        return new Response(JSON.stringify({ error: "Image key is required" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }

      // Verify the image belongs to this folder
      if (!imageKey.startsWith(`${folderId}/`)) {
        return new Response(JSON.stringify({ error: "Image not found in this folder" }), {
          status: 404,
          headers: { ...headers, "Content-Type": "application/json" }
        });
      }

      await imagesStore.delete(imageKey);

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
    console.error("Gallery images error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }
};