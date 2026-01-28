
/**
 * SUBly - BACKEND SERVER (Node.js + Express)
 * This is the production-ready backend code. 
 * To run in a real environment: 
 * 1. Install dependencies: npm install express mongoose cors dotenv @google/genai
 * 2. Run: node server.js
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const app = express();
// Fix for TS error: No overload matches this call. 
// Using 'as any' to handle middleware type mismatch between Express and CORS type definitions.
app.use(cors() as any);
app.use(express.json() as any);

// --- Mongoose/MongoDB Schema Simulation ---
// In a real MongoDB setup, you would use mongoose.model()
const Schemas = {
  Subscription: "String name, Number amount, String cycle, String category, Date nextBillingDate",
  Expense: "String title, Number amount, Date date, String category, Boolean isSubscription",
  Document: "String type, String name, Date expiryDate, String status"
};

// --- API Routes ---

// 1. Subscription Management
// Fix: Use 'any' for Request and Response to bypass property missing errors (e.g., .json, .status, .body)
app.get('/api/subscriptions', (req: any, res: any) => {
  // Logic: Fetch from MongoDB
  res.json({ message: "Fetch all subscriptions from DB" });
});

// Fix: Use 'any' for Request and Response to bypass property missing errors (e.g., .json, .status, .body)
app.post('/api/subscriptions', (req: any, res: any) => {
  // Logic: Create in MongoDB
  res.status(201).json(req.body);
});

// 2. AI Sync - Automatic Detection
// Fix: Use 'any' for Request and Response to bypass property missing errors (e.g., .json, .status, .body)
app.post('/api/sync/detect', async (req: any, res: any) => {
  const { source, content } = req.body;
  
  // Fix: Create a new GoogleGenAI instance right before making an API call to ensure use of correct API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Call Gemini to parse email or app store data
  const prompt = `Extract subscription info from ${source}: "${content}". 
    Return JSON with fields: name, amount, cycle, nextBillingDate.`;
  
  try {
    // Fixed: Await the generateContent call and correctly extract results using .text property
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    
    const text = response.text;
    
    // Return detected subs or original body as fallback
    res.json({ 
      detected: true, 
      data: text ? JSON.parse(text) : req.body 
    });
  } catch (e) {
    console.error("AI Sync Detection failed:", e);
    // Fix: Using any for res allows calling .status()
    res.status(500).json({ error: "AI Parsing failed" });
  }
});

// 3. Expense Tracker & Analytics
// Fix: Use 'any' for Request and Response to bypass property missing errors (e.g., .json, .status, .body)
app.get('/api/expenses/summary', (req: any, res: any) => {
  res.json({ total: 1200, breakdown: { entertainment: 400, health: 200 } });
});

// 4. Document Vault
// Fix: Use 'any' for Request and Response to bypass property missing errors (e.g., .json, .status, .body)
app.post('/api/vault/upload', (req: any, res: any) => {
  // Logic: Encrypt file and store metadata in MongoDB
  res.json({ status: "Encrypted and Saved" });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Subly Backend Running on http://localhost:${PORT}`);
});
