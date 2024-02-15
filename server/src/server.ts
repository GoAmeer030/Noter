import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import multer from "multer";

import fs from 'fs';
import path from 'path';
import { config as dotenvConfig } from "dotenv";

import TopicManager from "./managers/topicManager";
import AuthManager from "./managers/authManager";

// Loading env variables
dotenvConfig();


// Multer configuration
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir;
        if (req.body.staffid) {
            dir = 'public/profilepic/';
        } else {
            const departmentMap = {
                1: 'CSE',
                2: 'IT',
                3: 'ECE',
                4: 'EEE'
            }
            dir = 'public/data/' + req.body.syllabus + '/' + departmentMap[req.body.department as keyof typeof departmentMap] + '/' + req.body.year + '/' + req.body.semester + '/' + req.body.subjectCode;
        }
        fs.mkdirSync(path.join(__dirname, '../' + dir), { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        let fileName;
        if (req.body.staffid) {
            fileName = req.body.staffid + 'profilepic.' + file.originalname.split('.').pop();
        } else {
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            fileName = req.body.fileName + '_' + formattedDate + '.' + file.originalname.split('.').pop();
        }
        cb(null, fileName);
    }
});
const upload = multer({ storage: storage });


// Express app configuration
const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/public", express.static("public"));


// Prisma client configuration
const prisma = new PrismaClient();


// Basic Routes
app.get("/", async (req, res) => {
    const staffCount = await prisma.staff.count();
    const topicCount = await prisma.topic.count();
    const assetCount = await prisma.asset.count();

    res.status(200).send({
        staffCount,
        topicCount,
        assetCount
    });
})


// Auth Routes
const authManager = new AuthManager();

app.post("/verify-token", upload.none(), (req, res) => {
  authManager.verifyTokenHandler(req, res);
});

app.post("/login", upload.none(), (req, res) => {
  authManager.loginHandler(req, res);
});


// Topic Routes
const topicManager = new TopicManager();

app.post("/addtopic", upload.single('file'), (req, res, next) => {
    topicManager.addTopicHandler(req, res, authManager);
});

app.get("/gettopics", upload.none(), (req, res) => {
    topicManager.getTopicHandler(req, res);
});

app.delete("/deletetopic/:id", upload.none(), (req, res) => {
    topicManager.deleteTopicHandler(req, res, Number(req.params.id), authManager);
});


// Server configuration
app.listen(3001, (): void => {
  console.log("\nServer Ready\n> Port : 3001");
});
