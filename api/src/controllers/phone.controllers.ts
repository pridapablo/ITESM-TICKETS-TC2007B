import twilio from "twilio";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../const"
import user from "../models/user";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


//@ts-ignore
export const handleTicket = async (req, res) => {
    // @ts-ignore body unused 
    const { Body, WaId } = req.body;
    try {
        const u = await user.findOne({ phone: WaId });
        if (!u) {
            // User is not signed up
             await client.messages.create({
                body: "Lo sentimos, tu teléfono no está dado de alta",
                from: "whatsapp:+14155238886",
                to: `whatsapp:${WaId}`,
                });

            return res.status(404).json({
                success: false,
                message: `User with phone number ${WaId} not found`,
            });
        } 
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred'
        });

    }
   

}

//@ts-ignore
export const sendConfirmation = async (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone) {
        res.status(400).json({ message: 'Faltan datos' });
    }
try {
    const message = await client.messages.create({
      body: `Felicidades, ${name}. Ya puedes crear tickets desde aquí.`,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${phone}`,
    });

    console.log(message.sid);
    console.log(message.body);
    res.status(200).json({ message: "Message sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending message" });
}}
