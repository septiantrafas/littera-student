import { KJUR } from "jsrsasign";

interface Request {
  body: {
    topic: string,
    password: string,
  }
}

const getSignature = async (req: Request, res: any) => {
  const { topic, password } = req.body

  const sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY
  const sdkSecret = process.env.NEXT_PUBLIC_ZOOM_SDK_SECRET

  // try {
  const iat = Math.round(new Date().getTime() / 1000);
  const exp = iat + 60 * 60 * 2;

  // Header
  const oHeader = { alg: "HS256", typ: "JWT" };

  // Payload
  const oPayload = {
    app_key: sdkKey,
    iat,
    exp,
    tpc: topic,
    pwd: password,
  };

  // Sign JWT
  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);

  return res.status(200).json({
    signature: KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret),
  });
};

export default getSignature;
