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
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes blog content in 2-3 lines.',
        },
        {
          role: 'user',
          content: `Summarize this post:\n\n${content}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate summary' });
  }
});

module.exports = router;
