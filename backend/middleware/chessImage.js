import { default as ChessImageGenerator } from "chess-image-generator";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";
import uniqid from "uniqid";
const __dirname = dirname(fileURLToPath(import.meta.url));
/* Middleware che genera l'immagine della board a partire dal FEN passato come route parameter */
export const generateBoard = async (req, res) => {
  let imageGenerator = new ChessImageGenerator();
  try {
    await imageGenerator.loadFEN(req.query.fen);
    const id = uniqid();
    const imagePath = join(__dirname, "..", "boards", `board${id}.png`);
    await imageGenerator.generatePNG(imagePath);
    res.setHeader("content-type", res.type(".png"));
    setTimeout(() => res.sendFile(imagePath), 500);
    setTimeout(function () {
      fs.unlink(imagePath, (err) => {
        if (err) console.log(err);
        else {
          console.log(`Deleted file: ${imagePath}`);
        }
      });
    }, 6000);
    return;
  } catch (error) {
    res.sendFile(join(__dirname, "..", "boards", "invalid.html"));
  }
};
