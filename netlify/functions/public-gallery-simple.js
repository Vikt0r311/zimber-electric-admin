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
              src: "https://picsum.photos/400/300?random=1",
              alt: "Tata projekt - Elektromos panel telepítés"
            },
            {
              name: "led-vilagitas.jpg", 
              src: "https://picsum.photos/400/300?random=2",
              alt: "Tata projekt - Modern LED világítási rendszer"
            },
            {
              name: "kapcsolo-rendszer.jpg",
              src: "https://picsum.photos/400/300?random=3", 
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
              src: "https://picsum.photos/400/300?random=4",
              alt: "Komárom projekt - Üzlethelyiség világítás"
            },
            {
              name: "biztonsagi-rendszer.jpg", 
              src: "https://picsum.photos/400/300?random=5",
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