import { Server } from "socket.io";
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.static('public'));

const allowedOrigins = [
  "http://localhost:3000",
  "https://cloudbox-c58m4zlrh-cientistaphps-projects.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS bloqueado"));
    }
  },
  credentials: true
}));

const server = http.Server(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://cloudbox-c58m4zlrh-cientistaphps-projects.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', socket => {
  socket.on('connectRoom', box => {
    socket.join(box);
  });
});

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("MongoDB conectado OK");
});

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚠️ __dirname não existe em ESM
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

import routes from './routes.js';
app.use(routes);

server.listen(process.env.PORT || 3333);