const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const folderId = event.queryStringParameters?.folder;
    const imageIdentifier = event.queryStringParameters?.image;

    if (!folderId || !imageIdentifier) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Folder ID and image identifier are required" })
      };
    }

    console.log(`Delete request - Folder: ${folderId}, Image: ${imageIdentifier}`);

    // Try to delete the image from Supabase Storage
    let filePath;
    
    // If imageIdentifier is already a full path (starts with gallery/), use it directly
    if (imageIdentifier.startsWith('gallery/')) {
      filePath = imageIdentifier;
    } else {
      // Otherwise, construct the path
      filePath = `gallery/${folderId}/${imageIdentifier}`;
    }

    console.log(`Attempting to delete: ${filePath}`);

    const { data, error } = await supabase.storage
      .from('images')
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return {
        statusCode: 500,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Delete failed: ${error.message}` })
      };
    }

    console.log(`Successfully deleted: ${filePath}`);

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Image deleted successfully",
        deletedPath: filePath
      })
    };

  } catch (error) {
    console.error('Delete error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: `Server error: ${error.message}` })
    };
  }
};