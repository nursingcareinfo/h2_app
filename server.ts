import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database setup
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.warn("WARNING: DATABASE_URL environment variable is not set. Database features will be unavailable.");
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl ? {
      rejectUnauthorized: false
    } : false
  });

  app.use(express.json());

  // API routes
  app.get("/api/config", (req, res) => {
    res.json({
      supabaseUrl: process.env.APP_URL || "https://awubxwgfxvyvmbnjhbef.supabase.co",
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_URL: process.env.APP_URL || "https://awubxwgfxvyvmbnjhbef.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_ANON_KEY
    });
  });

  app.get("/api/db-check", async (req, res) => {
    if (!databaseUrl) {
      return res.status(500).json({ 
        status: "error", 
        message: "DATABASE_URL is not configured. Please add it to your Secrets in AI Studio Settings." 
      });
    }
    
    const url = new URL(databaseUrl.replace("postgresql://", "http://"));
    const hostname = url.hostname;

    try {
      const result = await pool.query("SELECT NOW()");
      res.json({ status: "ok", time: result.rows[0].now });
    } catch (error) {
      const errorDetails = {
        message: error instanceof Error ? error.message : String(error),
        code: (error as any).code,
        host: hostname,
        port: url.port || "5432"
      };
      
      console.error("Database connection error details:", errorDetails);
      
      let errorMessage = errorDetails.message;
      let hint = "Check if your DATABASE_URL is correct and your database is accessible.";
      
      // Specific check for Cloudflare IPs which indicate wrong hostname
      if (errorMessage.includes("104.18.") || errorMessage.includes("172.64.") || errorMessage.includes("104.17.")) {
        hint = "CRITICAL ERROR: You are connecting to a Cloudflare IP. This means you are using the 'API URL' (project.supabase.co) instead of the 'Database Host'. \n" +
               "FIX: Go to Supabase > Settings > Database and copy the 'Connection Pooler' string. It should use port 6543.";
      } else if (errorMessage.includes("ETIMEDOUT")) {
        hint = "Connection timed out. This environment only supports IPv4. \n" +
               "FIX: Use the 'Connection Pooler' string from Supabase (Settings > Database) which uses port 6543 and supports IPv4. \n" +
               "Do NOT use the direct connection on port 5432.";
      }

      res.status(500).json({ 
        status: "error", 
        message: errorMessage,
        hint: hint,
        details: errorDetails
      });
    }
  });

  app.post("/api/db-init", async (req, res) => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS staff (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          full_name TEXT NOT NULL,
          cnic TEXT UNIQUE,
          gender TEXT,
          category TEXT,
          designation TEXT,
          phone_primary TEXT,
          whatsapp_number TEXT,
          email TEXT,
          area_town TEXT,
          complete_address TEXT,
          rating DECIMAL(3,2) DEFAULT 0,
          experience_years INTEGER DEFAULT 0,
          is_available BOOLEAN DEFAULT true,
          is_active BOOLEAN DEFAULT true,
          is_verified BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS patients (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          full_name TEXT NOT NULL,
          cnic TEXT,
          date_of_birth DATE,
          gender TEXT,
          blood_group TEXT,
          mobile_number TEXT,
          area_town TEXT,
          complete_address TEXT,
          primary_diagnosis TEXT,
          current_medications TEXT,
          allergies TEXT,
          service_type TEXT,
          shift_type TEXT,
          start_date DATE,
          duration TEXT,
          status TEXT DEFAULT 'Pending',
          assigned_staff_id UUID REFERENCES staff(id),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      res.json({ status: "ok", message: "Tables initialized successfully" });
    } catch (error) {
      res.status(500).json({ status: "error", message: error instanceof Error ? error.message : String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
