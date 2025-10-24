import sharp from "sharp";
import path from "node:path";
const imagepath = (path.resolve('public/download.jpg'));
const imageFolder = (path.resolve('public/artificial-intelligence-ai-toolshero.jpg'))
export async function resizeimage() {
    await sharp(imagepath)
    .resize(200,200)
    .toFile(path.join(imageFolder))
    console.log('Images resized successfully');
}
