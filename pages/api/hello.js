// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dayjs from "dayjs";
import { Server } from "socket.io";

const ioHandler = (req, res) => {
  // const time = dayjs();
  // res.statusCode = 200;
  // res.json({ name: "John Doe", time: time });

  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", function (socket) {
      setInterval(function () {
        var time = dayjs();
        socket.emit("counter", time);
      }, 1000);
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
