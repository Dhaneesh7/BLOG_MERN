// import express from 'express';
const mongoose = require('mongoose');
const express= require('express');
// import mongoose from 'mongoose';
// import cors from 'cors';
const cors= require('cors');
const cookieParser=require('cookie-parser')
const dotenv = require('dotenv');
// import dotenv from 'dotenv';
const Post = require('./routes/Posts');
const User = require('./routes/Users');
const Auth= require('./routes/Auth')
// const aiRoutes = require('./routes/ai');
// import Post from './routes/Posts';
const connecttodb = require('./config/db');
// import connecttodb from './config/db';

// const postRoutes=require("./routes/Posts")
dotenv.config();
const app = express();
app.use(cookieParser()); 
app.use(cors(
    {
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
    }
));
app.use(express.json());
connecttodb();
app.use('/api/posts',Post);
app.use('/api/users',User);
app.use('/api/auth',Auth);
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));