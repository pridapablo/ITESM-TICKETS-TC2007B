import twilio from "twilio";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../config.js";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

//@ts-ignore
export const sendConfirmation = async (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone) {
        res.status(400).json({ message: 'Faltan datos' });
    }
try {
    const message = await client.messages.create({
      body: `Felicidades, ${name}. Ya puedes crear tickets desde aquí`,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${phone}`,
    });

    console.log(message.sid);
    res.status(200).json({ message: "Message sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending message" });
}}
