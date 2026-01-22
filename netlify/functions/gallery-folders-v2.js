// Real gallery folders function - updated $(date)
let mockFolders = [
  {
    id: "tata-140m2-csaladi-haz",
    name: "Tata - 140m² Családi Ház", 
    folder: "tata-140m2-csaladi-haz",
    imageCount: 59
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
      // Return mock folders
      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(mockFolders)
      };
    }

    if (method === "POST") {
      // Create mock folder
      const { name, folder } = JSON.parse(event.body || '{}');
      
      if (!name || !folder) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Name and folder ID are required" })
        };
      }

      const newFolder = {
        id: folder,
        name: name.trim(),
        folder: folder,
        imageCount: Math.floor(Math.random() * 3), // Random 0-2 images for demo
        createdAt: new Date().toISOString()
      };
      
      mockFolders.push(newFolder);

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, message: "Mock folder created", folder: newFolder })
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