import { Canvas, createCanvas } from "canvas";
import { AttachmentBuilder, Message } from "discord.js";
import { colorRegex } from "./colorRegex";

export const sendColor = (message: Message) => {
    const m = message.content.toLowerCase();
    const substrColor = (s: string) => {
        let result = m.substring(m.indexOf(`${s}(`), m.indexOf(")", m.indexOf(`${s}(`)) + 1);
        return result !== m.substring(0, m.indexOf(")") + 1) ? result : undefined; // If color doesn't actually match, return undefined
    };
    let color = undefined;

    if (colorRegex.test(m.replace(/ /g, ""))) {
        color = m.replace(/ /g, "");
    } else {
        let hexColor = m
            .replace(/\n/g, " ")
            .split(" ")
            .find(item => item.includes("#"));
        let rgbColor = substrColor("rgb");
        let rgbaColor = substrColor("rgba");
        let hslColor = substrColor("hsl");
        let hslaColor = substrColor("hsla");

        color = hexColor ?? rgbColor ?? rgbaColor ?? hslColor ?? hslaColor;
        if (!color) return;

        color = color.replace(/ /g, "");

        const isColor = colorRegex.test(color);
        if (!isColor) return message.channel.send("`Invalid color.`");
    }

    const canvas: Canvas = createCanvas(200, 50);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const image = new AttachmentBuilder(canvas.toBuffer(), { name: "image.png" });
    message.channel.send({ content: `\`${color}\``, files: [image] });
};
