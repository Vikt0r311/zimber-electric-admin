import { getStore } from "@netlify/blobs";
import { v4 as uuid } from "uuid";

// Image upload functionality
export default async (req, context) => {
  const method = req.method;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  if (method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }

  try {
    const folderId = context.params.folderId;
    
    if (!folderId) {
      return new Response(JSON.stringify({ error: "Folder ID is required" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    // Check if folder exists
    const metaStore = getStore("gallery-metadata");
    const foldersData = await metaStore.get("folders", { type: "json" }) || {};
    
    if (!foldersData[folderId]) {
      return new Response(JSON.stringify({ error: "Folder not found" }), {
        status: 404,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    const form = await req.formData();
    const files = form.getAll("images"); // Multiple files support
    
    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: "No files provided" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    const imagesStore = getStore("gallery-images");
    const uploadedImages = [];

    for (const file of files) {
      if (!file || !file.name) continue;
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        continue; // Skip invalid files
      }

      // Generate unique key with folder prefix
      const extension = file.name.split('.').pop();
      const key = `${folderId}/${uuid()}.${extension}`;
      
      // Store image in blobs
      await imagesStore.set(key, file);
      
      uploadedImages.push({
        key,
        name: file.name,
        size: file.size,
        type: file.type
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      uploaded: uploadedImages.length,
      images: uploadedImages 
    }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }
};