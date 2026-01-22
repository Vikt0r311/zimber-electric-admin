// Static gallery data - guaranteed to work
exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  // Static gallery data
  const galleries = [
    {
      id: "tata-csaladi-haz",
      name: "Tata - 140m² Családi Ház", 
      folder: "tata-csaladi-haz",
      imageCount: 4,
      images: [
        {
          name: "elektromos-panel.jpg",
          src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300",
          alt: "Elektromos panel telepítés"
        },
        {
          name: "led-vilagitas.jpg", 
          src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300",
          alt: "Modern LED világítási rendszer"
        },
        {
          name: "kapcsolo-rendszer.jpg",
          src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300",
          alt: "Okos kapcsoló rendszer"
        },
        {
          name: "befejezett-munka.jpg",
          src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300", 
          alt: "Befejezett villanyszerelési munka"
        }
      ]
    },
    {
      id: "komarom-uzlet",
      name: "Komárom - Üzlethelyiség Korszerűsítés",
      folder: "komarom-uzlet", 
      imageCount: 3,
      images: [
        {
          name: "uzlet-vilagitas.jpg",
          src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300",
          alt: "Üzlethelyiség világítás"
        },
        {
          name: "biztonsagi-rendszer.jpg",
          src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300", 
          alt: "Biztonsági rendszer telepítés"
        },
        {
          name: "vegleges-allapot.jpg",
          src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300",
          alt: "Végleges állapot"
        }
      ]
    },
    {
      id: "tatabanya-lakas",
      name: "Tatabánya - 80m² Lakás Felújítás", 
      folder: "tatabanya-lakas",
      imageCount: 2,
      images: [
        {
          name: "lakas-panel.jpg",
          src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300",
          alt: "Lakás elektromos panel"
        },
        {
          name: "modern-kapcsolok.jpg",
          src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300",
          alt: "Modern kapcsolók"
        }
      ]
    }
  ];

  return {
    statusCode: 200,
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(galleries)
  };
};