/**IMPORT LIBERAI */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import express  from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import dotenv from 'dotenv'
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path"
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose"
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
// import { jobs, companies, users } from "./utils/data.js";
import dbConnection from "./database/dbConnection.js";
import router from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";


/**IMPORT FILES */
import connectDB from "./config/db.js";
import userRouter from "./router/userR.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import chatRoutes from "./router/chatR.js";
import { register } from "./controllers/auth.js";
import  {createPost}  from "./controllers/postsC.js";
import authRoutes from './routes/AuthRoutes.js'
import { veryFyToken } from "./middleware/AuthMiddleware.js";
import usersRouts from './routes/users.js'
import postsRouts from './routes/postRoutes.js'

/**CONFIGARATIONS */
const app = express();
dotenv.config();
connectDB();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const express = require("express");
const path = require("path");
const cors = require("cors");
const corsOptions = require("./configOptions/corsOptions.js");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const veriFyJWT = require("./middleware/veriFy.js");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials.js");
const mongoose = require("mongoose");
const connectDB = require("./configOptions/dbConn.js");


/**DOT ENV */
const PORT = process.env.PORT || 5000;
const DB = process.env.MONGO_URL

/**MIDDLEWARE */
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit:"30mb", extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}))
app.use("/assets",express.static(path.join(__dirname, "public/assets")))
app.disable("x-powered-by");
app.use(logger);// custom middleware logger
app.use(credentials);//add fetch cookie credintels requirment
app.use(cors(corsOptions));// Cross Origin Resource Sharing
app.use(express.urlencoded({ extended: false }));// built-in middleware to handle urlencoded from data
app.use(express.json());// built-in middleware for json
app.use(cookieParser());//middleware for cookies
app.use("/", express.static(path.join(__dirname, "/public")));//serve static files
app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/**END POINTS */
app.use('/api/user',userRouter)
app.use('/api/chat',chatRoutes)

//IMPORTS ROUTES
app.use('/auth',authRoutes)
app.use('/users',usersRouts)
app.use('/posts',postsRouts)



//Handling all ports
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      res.json({ error: "404 Not Found" });
    } else {
      res.type("txt").send("404 Not Found");
    }
  });

/**Middleware for error handling */
app.use(notFound)
app.use(errorHandler)


//FILE STORAGE
const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,"public/assets")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

//Uploading file in multer or local storage
const upload = multer({storage})

/**Middleware for error handling */
app.use(notFound)
app.use(errorHandler)

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});


// mongoose.connect(DB,{
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
// }).then(()=>{
    // app.listen(PORT,()=>console.log(`Everything is running on port : ${PORT}`))
    /* ADD DATA ONE TIME */
    // User.insertMany(users)
    // Post.insertMany(posts)

// }).catch((err)=>{
    // console.log(` ${err} Did'n connect `)
// })