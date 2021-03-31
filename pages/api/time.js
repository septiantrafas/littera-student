// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const ioHandler = (req, res) => {
  const time = dayjs().tz("Asia/Jakarta");
  res.statusCode = 200;
  res.json({ time: time });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
