// Ultra-simple upload that just returns success and tells you where to put images manually
exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS", 
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== "POST") {
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
        body: JSON.stringify({ error: "Folder required" })
      };
    }

    // Generate a simple filename
    const timestamp = Date.now();
    const filename = `uploaded-${timestamp}.jpg`;
    
    console.log(`Upload simulation for folder: ${folderId}, file: ${filename}`);

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Upload simulated - check console",
        images: [{
          name: filename,
          // Use existing galeria path so image actually loads
          path: `/galeria/tata-140m2-csaladi-haz/Image01.webp`, // Use existing image
          size: 12345,
          type: "image/jpeg"
        }]
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message })
    };
  }
};