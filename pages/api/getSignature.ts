import crypto from "crypto";

const getUser = async (req, res) => {
  const timestamp = new Date().getTime() - 30000;

  console.log("meetingNumber", req.body.meetingNumber);
  console.log("role", req.body.role);

  console.log("API_KEY", process.env.NEXT_PUBLIC_ZOOM_API_KEY);
  console.log("API_SECRET", process.env.NEXT_PUBLIC_ZOOM_API_SECRET);

  const msg = Buffer.from(
    process.env.NEXT_PUBLIC_ZOOM_API_KEY +
      req.body.meetingNumber +
      timestamp +
      req.body.role
  ).toString("base64");

  const hash = crypto
    .createHmac("sha256", process.env.NEXT_PUBLIC_ZOOM_API_SECRET)
    .update(msg)
    .digest("base64");

  const signature = Buffer.from(
    `${process.env.NEXT_PUBLIC_ZOOM_API_KEY}.${req.body.meetingNumber}.${timestamp}.${req.body.role}.${hash}`
  ).toString("base64");

  return res.status(200).json({
    signature: signature,
  });
};

export default getUser;
