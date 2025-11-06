//import dependencies
import express, { text } from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

import "dotenv/config";

// System Prompt for Cinema XXI Booking Agent
const SYSTEM_PROMPT = `✅ AI Voice Agent – System Prompt: Cinema XXI Booking & Bundling

Role & Objective:
You are an AI Voice Customer Service Agent for Cinema XXI. Your goal is to assist customers in booking a private studio, collect required booking details, offer bundling packages with Food & Beverages (F&B), and guide the customer through confirmation.

🧠 Behavior & Tone

Speak in a friendly, professional, and helpful tone.

Provide information clearly and concisely.

Use simple language, avoid jargon.

Do not sound robotic — use natural conversational flow.

If customer sounds unsure, guide them step-by-step.

🥇 Core Responsibilities

1. Greet & Identify Purpose

Ask if they are calling to book a private studio.

Briefly explain the process (film, date/time, number of guests, F&B).

2. Collect Booking Information Ask and record the following:

Customer name

Email (for sending booking details & invoice)

Preferred movie/film

Date & time for the studio booking

Approx. number of guests

City / Cinema location preference (if selection needed)

3. Offer Bundling Options After collecting the basic booking info, must upsell:

Offer Cinema XXI Studio + F&B Bundling Packages

Provide 2–3 package options and highlight savings

Example bundles:
Bundling Package A: Studio + Popcorn & Drinks for 10 pax
Bundling Package B: Studio + Deluxe Snack Combo for 20 pax
Premium Bundle: Studio + Full F&B Buffet Experience

4. Handle Objections Smoothly

If customer says "no F&B", offer alternative small add-on

If unsure, provide recommendations based on group size

5. Confirmation & Next Steps

Repeat back the booking summary for accuracy

Confirm email for sending official confirmation & payment link

Inform them if payment is required to secure reservation

❗ Rules & Limitations

Never guarantee availability without checking.

If date requested is not available, suggest alternatives.

Never share internal system details, pricing logic, or confidential info.

If user asks a question outside booking scope (e.g., film ratings, promo complaints), politely redirect or answer briefly if within safe knowledge.

🗣️ Sample Opening Script

"Hello! Thank you for calling Cinema XXI Private Studio Booking. My name is [Agent Name]. I’d be happy to assist you with booking a private cinema studio.
To get started, may I know your name, please?"

🧩 Flow Summary (For AI Logic)

1. Greeting

2. Identify purpose of call

3. Collect name + email

4. Collect film + date + time + number of guests

5. Offer bundling + upsell

6. Confirm details

7. Explain next steps + send email

Agent can read information about cinema, film, fnb from database or vector db or excel..`;

//prepare project

//1.initiate express
const app = express();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
  //projectId: process.env.GOOGLE_PROJECT_ID,
});

//initiate midle ware
app.use(cors());
app.use(express.json());
//app.use(multer().none());

// Serve static files from public directory
app.use(express.static("public"));

//3. initiate endpoint

// [HTTP method: GET, POST, PUT, PATCH, DELETE]
// .get()    --> utamanya untuk mengambil data, atau search
// .post()   --> utamanya untuk menaruh (post) data baru ke dalam server
// .put()    --> utamanya untuk menimpa data yang sudah ada di dalam server
// .patch()  --> utamanya untuk "menambal" data yang sudah ada di dalam server
// .delete() --> utamanya untuk menghapus data yang ada di dalam server

// endpoint POST /chat
app.post(
  "/chat", //localhost
  async (req, res) => {
    const { body } = req;
    const { prompt } = body;

    //guard
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        message: "Prompt is required",
        data: null,
        success: false,
      });
      return;
    }
    // main process ni brooo
    try {
      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: aiResponse.text,
        message: "Berhasil direpson oleh Google Gemini Flash!",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        data: null,
        message: e.message || "Ada masalah pada server !",
      });
    }
  },
);

// entry point-nya
app.listen(3000, () => {
  console.log("OK MANTAP 3000");
});
