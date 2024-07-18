import express from "express";
import type { Request, Response } from 'express';
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
let countClient = 0;
let countBlock = [false];

app.get('/block', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/block.html');
});

io.on('connection', (socket) => {
  countClient++;

  console.log('a user connected');

  io.emit("count_client", countClient);
  io.emit("count_block", countBlock);

  socket.on('add_block', () => {
    countBlock.push(false);
    io.emit('count_block', countBlock);
  });

  socket.on('rmv_block', () => {
    if (countBlock.length > 0) countBlock.pop();
    io.emit('count_block', countBlock);
  });

  socket.on('click_block', (msg) => {
    var val = countBlock[msg];
    countBlock[msg] = !val;
    io.emit('count_block', countBlock);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    countClient--;
    io.emit("count_client", countClient);
  });
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});