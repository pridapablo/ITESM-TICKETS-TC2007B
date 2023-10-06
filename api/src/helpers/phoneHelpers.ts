
import twilio from "twilio";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../const"
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


export const restartChatbot = async (WaId: string, u: any) => {
    await client.messages.create({
        body: "Error. Vuelve a comenzar enviando un mensaje con la palabra 'ticket'.",
        from: "whatsapp:+14155238886",
        to: `whatsapp:+${WaId}`,
    });
    u.chat_state = 0;
    await u.save();
}

export const printMessage = async (WaId: string, message: string) => {
    await client.messages.create({
        body: message,
        from: "whatsapp:+14155238886",
        to: `whatsapp:+${WaId}`,
    });
}