require("dotenv").config();
import { Canvas, createCanvas } from "canvas";
import { AttachmentBuilder, Client, IntentsBitField, Message, Partials } from "discord.js";
import { sendColor } from "./util/sendColor";

export const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    intents: ["Guilds", "GuildMessages", "MessageContent"],
});

console.log("Bot is starting...");
client.login(process.env.TOKEN);

// Listen for messages w/ color in them
client.on("messageCreate", async (message: Message) => {
    if (message.author.id === client.user!.id) return;
    sendColor(message);
});

client.on("ready", async () => {
    if (!client.user || !client.application) {
        return;
    }

    console.log(`${client.user.username} is online.`);
});
