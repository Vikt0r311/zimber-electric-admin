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
    "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const folderId = event.queryStringParameters?.folder;
    if (!folderId) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Folder ID is required" })
      };
    }

    // Get static images first
    const staticImages = getStaticImages(folderId);

    // Get uploaded images from Supabase Storage
    let uploadedImages = [];
    try {
      console.log(`Looking for uploaded images in: gallery/${folderId}`);
      const { data, error } = await supabase.storage
        .from('images')
        .list(`gallery/${folderId}`);

      if (error) {
        console.error('Supabase list error:', error);
      } else if (data) {
        console.log(`Found ${data.length} uploaded images in Supabase`);
        uploadedImages = data
          .filter(file => file.name !== '.emptyFolderPlaceholder') // Filter out placeholder files
          .map(file => {
            const filePath = `gallery/${folderId}/${file.name}`;
            const { data: { publicUrl } } = supabase.storage
              .from('images')
              .getPublicUrl(filePath);

            console.log(`Mapped uploaded image: ${file.name} -> ${publicUrl}`);
            console.log(`Full file path: ${filePath}`);
            
            return {
              name: file.name,
              path: publicUrl,
              src: publicUrl, // Add src for compatibility
              alt: `${folderId} - ${file.name}`, // Add alt text
              key: filePath,
              uploaded: true,
              size: file.metadata?.size || 0,
              updated_at: file.updated_at
            };
          });
      }
    } catch (error) {
      console.error('Error fetching uploaded images:', error);
    }

    const allImages = [...staticImages, ...uploadedImages];
    console.log(`Returning ${allImages.length} images for ${folderId} (${staticImages.length} static, ${uploadedImages.length} uploaded)`);

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(allImages)
    };

  } catch (error) {
    console.error('Images list error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: `Server error: ${error.message}` })
    };
  }
};

function getStaticImages(folderId) {
  const staticImageMaps = {
    'tata-140m2-csaladi-haz': generateImageList('tata-140m2-csaladi-haz', 58),
    'komarom-64m2-panellakas': generateImageList('komarom-64m2-panellakas', 16),
    'almasfuzito-55m2-panellakas': generateImageList('almasfuzito_55m2_panellakas', 26),
    'kiseloszto-csere': generateImageList('kiseloszto-csere', 2),
    'homlokzati-hoszigeteleshez-szerelvenyek': generateImageList('homlokzati-hoszigeteleshez-szerelvenyek', 6)
  };

  return staticImageMaps[folderId] || [];
}

function generateImageList(folderName, count) {
  const images = [];
  for (let i = 1; i <= count; i++) {
    const paddedNum = String(i).padStart(2, '0');
    images.push({
      name: `Image${paddedNum}.webp`,
      path: `/galeria/${folderName}/Image${paddedNum}.webp`,
      static: true
    });
  }
  return images;
}