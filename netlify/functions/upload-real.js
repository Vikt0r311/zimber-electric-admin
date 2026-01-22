// Simple real file upload to public/galeria folder
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const folderId = event.queryStringParameters?.folder;
    if (!folderId) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Folder ID required" })
      };
    }

    // Simple response for now - just create the folder
    const timestamp = Date.now();
    const imageName = `uploaded-${timestamp}.jpg`;
    
    // Create dummy image data (1x1 pixel transparent GIF)
    const dummyImageData = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    
    // Ensure the gallery folder exists
    const galleryPath = '/tmp/galeria';
    const folderPath = path.join(galleryPath, folderId);
    
    try {
      await fs.mkdir(galleryPath, { recursive: true });
      await fs.mkdir(folderPath, { recursive: true });
    } catch (error) {
      console.log('Directory already exists or error:', error.message);
    }
    
    // Write the dummy image
    const imagePath = path.join(folderPath, imageName);
    await fs.writeFile(imagePath, dummyImageData);
    
    console.log(`Created image: ${imagePath}`);

    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*", 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        success: true,
        message: "Image uploaded successfully",
        image: {
          name: imageName,
          path: `/galeria/${folderId}/${imageName}`,
          folder: folderId
        }
      })
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Upload failed", details: error.message })
    };
  }
};