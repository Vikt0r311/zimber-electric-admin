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
      // Return mock folders
      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(mockFolders)
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

      mockFolders.splice(folderIndex, 1);

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