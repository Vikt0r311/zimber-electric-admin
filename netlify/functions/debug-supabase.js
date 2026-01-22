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
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    console.log('=== SUPABASE DEBUG ===');
    console.log('URL:', supabaseUrl ? 'SET' : 'NOT SET');
    console.log('Service Key:', supabaseServiceKey ? 'SET' : 'NOT SET');

    // Test connection
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Bucket list error:', bucketsError);
      return {
        statusCode: 500,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ 
          error: 'Failed to connect to Supabase',
          details: bucketsError.message 
        })
      };
    }

    console.log('Available buckets:', buckets.map(b => b.name));

    // Check images bucket
    const { data: imagesInRoot, error: rootError } = await supabase.storage
      .from('images')
      .list('', { limit: 100 });

    if (rootError) {
      console.error('Root list error:', rootError);
    } else {
      console.log('Root folder contents:', imagesInRoot.map(f => f.name));
    }

    // Check gallery folder
    const { data: galleryContents, error: galleryError } = await supabase.storage
      .from('images')
      .list('gallery', { limit: 100 });

    if (galleryError) {
      console.error('Gallery list error:', galleryError);
    } else {
      console.log('Gallery folder contents:', galleryContents.map(f => f.name));
    }

    // Check gallery/10 folder specifically
    const { data: gallery10Contents, error: gallery10Error } = await supabase.storage
      .from('images')
      .list('gallery/10', { limit: 100 });

    let imageUrls = [];
    if (gallery10Error) {
      console.error('Gallery/10 list error:', gallery10Error);
    } else {
      console.log('Gallery/10 folder contents:', gallery10Contents.map(f => ({ name: f.name, size: f.metadata?.size })));
      
      // Generate URLs for each image
      imageUrls = gallery10Contents.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(`gallery/10/${file.name}`);
        return {
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size
        };
      });
      
      console.log('Generated URLs:', imageUrls);
    }

    // Check gallery/kaka folder specifically
    const { data: galleryKakaContents, error: galleryKakaError } = await supabase.storage
      .from('images')
      .list('gallery/kaka', { limit: 100 });

    let kakaImageUrls = [];
    if (galleryKakaError) {
      console.error('Gallery/kaka list error:', galleryKakaError);
    } else {
      console.log('Gallery/kaka folder contents:', galleryKakaContents.map(f => ({ name: f.name, size: f.metadata?.size })));
      
      // Generate URLs for each image
      kakaImageUrls = galleryKakaContents.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(`gallery/kaka/${file.name}`);
        return {
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size
        };
      });
      
      console.log('Generated kaka URLs:', kakaImageUrls);
    }

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        buckets: buckets.map(b => b.name),
        rootContents: imagesInRoot ? imagesInRoot.map(f => f.name) : [],
        galleryContents: galleryContents ? galleryContents.map(f => f.name) : [],
        gallery10Contents: gallery10Contents ? gallery10Contents.map(f => ({ 
          name: f.name, 
          size: f.metadata?.size,
          updated: f.updated_at 
        })) : [],
        imageUrls: imageUrls,
        kakaImageUrls: kakaImageUrls
      })
    };

  } catch (error) {
    console.error('Debug error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message })
    };
  }
};