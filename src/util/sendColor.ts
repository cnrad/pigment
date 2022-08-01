import { Canvas, createCanvas } from "canvas";
import { AttachmentBuilder, Message } from "discord.js";
import { colorRegex } from "./colorRegex";

export const sendColor = (message: Message) => {
    const m = message.content.toLowerCase();
    let color = undefined;
    const substrColor = (s: string) => {
        let result = m.substring(m.indexOf(`${s}(`), m.indexOf(")", m.indexOf(`${s}(`)) + 1);
        return result !== m.substring(0, m.indexOf(")") + 1) ? result : undefined; // If color doesn't actually match, return undefined
    };

    if (colorRegex.test(m.replace(/ /g, ""))) {
        // If the color is the entire message
        color = m.replace(/ /g, "");
    } else {
        // If the color is somewhere in the message
        let hexColor = m
            .replace(/\n/g, " ")
            .split(" ")
            .find(item => item.includes("#"));
        let rgbColor = substrColor("rgb");
        let rgbaColor = substrColor("rgba");
        let hslColor = substrColor("hsl");
        let hslaColor = substrColor("hsla");

        color = hexColor ?? rgbColor ?? rgbaColor ?? hslColor ?? hslaColor; // Go through all of them until it finds whichever is valid
        if (!color) return;

        color = color.replace(/ /g, ""); // Remove spaces so colorRegex works

        const isColor = colorRegex.test(color);
        if (!isColor) return;
    }

    const canvas: Canvas = createCanvas(200, 50);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const image = new AttachmentBuilder(canvas.toBuffer(), { name: "image.png" });
    message.channel
      .send({ content: `\`${color}\``, files: [image], reply: { messageReference: message, failIfNotExists: false } })
      .catch(() => console.log("Failed to send message."));
};
