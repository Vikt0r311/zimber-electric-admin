// Simple public gallery function for troubleshooting
exports.handler = async (event, context) => {
  const method = event.httpMethod;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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
      // Return mock gallery folders with images for demo
      const mockGalleries = [
        {
          id: "tata-projekt",
          name: "Tata - 140m² Családi Ház Villanyszerelés",
          folder: "tata-projekt", 
          imageCount: 3,
          images: [
            {
              name: "elektromos-panel.jpg",
              src: "https://via.placeholder.com/400x300/1a1d29/00d9ff?text=Elektromos+Panel",
              alt: "Tata projekt - Elektromos panel telepítés"
            },
            {
              name: "led-vilagitas.jpg", 
              src: "https://via.placeholder.com/400x300/1a1d29/ffc107?text=LED+Világítás",
              alt: "Tata projekt - Modern LED világítási rendszer"
            },
            {
              name: "kapcsolo-rendszer.jpg",
              src: "https://via.placeholder.com/400x300/1a1d29/00d9ff?text=Kapcsoló+Rendszer", 
              alt: "Tata projekt - Okos kapcsoló rendszer"
            }
          ]
        },
        {
          id: "komarom-uzlet", 
          name: "Komárom - Üzlethelyiség Korszerűsítés",
          folder: "komarom-uzlet",
          imageCount: 2,
          images: [
            {
              name: "uzlet-vilagitas.jpg",
              src: "https://via.placeholder.com/400x300/2d3748/00d9ff?text=Üzlet+Világítás",
              alt: "Komárom projekt - Üzlethelyiség világítás"
            },
            {
              name: "biztonsagi-rendszer.jpg", 
              src: "https://via.placeholder.com/400x300/2d3748/ffc107?text=Biztonsági+Rendszer",
              alt: "Komárom projekt - Biztonsági kamera rendszer"
            }
          ]
        }
      ];

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(mockGalleries)
      };
    }

    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };

  } catch (error) {
    console.error("Simple public gallery error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};