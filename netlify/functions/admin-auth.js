// Simple admin authentication for Netlify Functions
exports.handler = async (event, context) => {
  const method = event.httpMethod;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    if (method === "POST") {
      // Login
      const { password } = JSON.parse(event.body);
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ZimberAdmin2026";
      console.log('Environment ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);
      console.log('Using password:', ADMIN_PASSWORD);
      
      if (password === ADMIN_PASSWORD) {
        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ success: true, token: "admin-authenticated" })
        };
      } else {
        return {
          statusCode: 401,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Invalid password" })
        };
      }
    }

    if (method === "GET") {
      // Check if authenticated
      const authHeader = event.headers.authorization || event.headers.Authorization;
      
      if (authHeader === "Bearer admin-authenticated") {
        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ authenticated: true })
        };
      } else {
        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ authenticated: false })
        };
      }
    }

    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };

  } catch (error) {
    console.error("Auth error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Authentication failed" })
    };
  }
};