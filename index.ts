import type { Socket } from "socket.io";
import express from "express";
import type { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public.html");
});

const totalTables = 18;
let tables = Array(totalTables).fill(0);

io.on("connection", (socket: Socket) => {
  console.log("Client Connected");

  socket.emit("update_tables", tables);

  socket.on("book_table", (index) => {
    if (tables[index] === 0) {
      tables[index] = 1;
      io.emit("update_tables", tables);
    }
  });

  socket.on("cancel_booking", (index) => {
    if (tables[index] === 1) {
      tables[index] = 0;
      io.emit("update_tables", tables);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
