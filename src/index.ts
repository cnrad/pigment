require("dotenv").config();
import { ActivityType, Client, Message, Partials } from "discord.js";
import { sendColor } from "./util/sendColor";

export const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.login(process.env.TOKEN);

// Listen for messages w/ color in them
client.on("messageCreate", async (message: Message) => {
    if (message.author.id === client.user!.id) return;
    sendColor(message);
});

client.on("ready", async () => {
    if (!client.user || !client.application) return;

    client.user.setPresence({
        activities: [{ name: `powered by hop.io`, type: ActivityType.Playing }],
        status: "dnd",
    });

    // nice green color cause why not
    console.log(`\u001b[1;32m${client.user.username} is online. \u001b[0m`);
});
