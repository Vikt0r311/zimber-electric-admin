// Gallery folders function v2 - restored Tata folder images
let mockFolders = [
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
]; // Static folders with real data

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
    if (method === "GET") {
      // Update image counts from Supabase Storage
      const foldersWithCounts = await Promise.all(mockFolders.map(async (folder) => {
        try {
          const { createClient } = require('@supabase/supabase-js');
          
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          
          let dynamicImageCount = folder.imageCount; // Default to static count
          
          if (supabaseUrl && supabaseServiceKey) {
            const supabase = createClient(supabaseUrl, supabaseServiceKey, {
              auth: {
                autoRefreshToken: false,
                persistSession: false
              }
            });

            // Get uploaded images count from Supabase
            const { data: images, error } = await supabase.storage
              .from('images')
              .list(`gallery/${folder.id}`);

            if (!error && images) {
              const uploadedCount = images.filter(img => img.name !== '.emptyFolderPlaceholder').length;
              
              // For static folders, add uploaded count to existing static count
              if (folder.imageCount > 0) {
                dynamicImageCount = folder.imageCount + uploadedCount;
              } else {
                // For dynamic folders (created by user), use only uploaded count
                dynamicImageCount = uploadedCount;
              }
            }
          }

          return {
            ...folder,
            imageCount: dynamicImageCount
          };
        } catch (error) {
          console.error(`Error counting images for folder ${folder.id}:`, error);
          return folder;
        }
      }));

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(foldersWithCounts)
      };
    }

    if (method === "POST") {
      // Create new folder
      const { name, folder } = JSON.parse(event.body || '{}');
      
      if (!name || !folder) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Name and folder ID are required" })
        };
      }

      // Check if folder already exists
      if (mockFolders.find(f => f.id === folder)) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Folder already exists" })
        };
      }

      const newFolder = {
        id: folder,
        name: name.trim(),
        folder: folder,
        imageCount: 0
      };
      
      mockFolders.push(newFolder);

      // Notify public-gallery-v2 about the new folder
      try {
        await fetch(`${event.headers.origin || 'https://zimber-electric.hu'}/.netlify/functions/public-gallery-v2`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'add_folder', 
            folder: newFolder 
          })
        });
        console.log('Successfully notified public gallery about new folder');
      } catch (notifyError) {
        console.log('Failed to notify public gallery about new folder:', notifyError);
      }

      return {
        statusCode: 201,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, message: "Folder created successfully", folder: newFolder })
      };
    }

    if (method === "DELETE") {
      // Delete folder
      const folderId = event.queryStringParameters?.id;
      
      if (!folderId) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Folder ID is required" })
        };
      }

      const folderIndex = mockFolders.findIndex(f => f.id === folderId);
      if (folderIndex === -1) {
        return {
          statusCode: 404,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Folder not found" })
        };
      }

      const deletedFolder = mockFolders[folderIndex];
      
      // Delete images from Supabase Storage first
      try {
        const { createClient } = require('@supabase/supabase-js');
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (supabaseUrl && supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          });

          // List all images in the folder
          const { data: images, error: listError } = await supabase.storage
            .from('images')
            .list(`gallery/${folderId}`);

          if (!listError && images && images.length > 0) {
            // Delete all images in the folder
            const imagePaths = images.map(img => `gallery/${folderId}/${img.name}`);
            const { error: deleteError } = await supabase.storage
              .from('images')
              .remove(imagePaths);

            if (deleteError) {
              console.error('Error deleting images from Supabase:', deleteError);
            } else {
              console.log(`Successfully deleted ${images.length} images from Supabase folder: ${folderId}`);
            }
          }
        }
      } catch (supabaseError) {
        console.error('Supabase deletion error:', supabaseError);
      }

      mockFolders.splice(folderIndex, 1);

      // Notify public-gallery-v2 about the deleted folder
      try {
        await fetch(`${event.headers.origin || 'https://zimber-electric.hu'}/.netlify/functions/public-gallery-v2`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'remove_folder', 
            folderId: deletedFolder.id 
          })
        });
        console.log('Successfully notified public gallery about deleted folder');
      } catch (notifyError) {
        console.log('Failed to notify public gallery about deleted folder:', notifyError);
      }

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, message: "Folder deleted successfully" })
      };
    }

    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };

  } catch (error) {
    console.error("Simple gallery folders error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};