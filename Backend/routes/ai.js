// routes/ai.js
// import express from 'express';
// import { OpenAI } from 'openai';
const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/summary', async (req, res) => {
      const { content } = req.body;

  try {
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const completion = await openai.chat.completions.create({
      // model: 'gpt-3.5-turbo',
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes blog content in 2-3 lines.',
        },
        {
          role: 'user',
          // content: `Summarize this post:\n\n${content}`,
          content: `Summarize this blog post in 2-3 lines:\n\n${content}`,
        },
      ],
      max_tokens: 100,
    });

const summary = completion?.choices?.[0]?.message?.content || "No summary generated";
res.json({ success: true, summary });
  } catch (err) {
    console.error(err);
  const fallback = generateSummaryLocal(content);

  res.json({
    summary: fallback,
    note: "Free local summary used",
  });
  }
});const generateSummaryLocal = (content) => {
  return content.split(" ").slice(0, 25).join(" ") + "...";
};


module.exports = router;
