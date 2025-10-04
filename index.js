//import dependencies
import express, { text } from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

import "dotenv/config";

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
