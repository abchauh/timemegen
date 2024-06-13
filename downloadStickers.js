import axios from "axios";

import fs from "fs";

import path from "path";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const stickerPackName = process.env.STICKER_PACK;
const outputDir = path.join(__dirname, 'src', 'stickers');

const downloadStickerPackImages = async () => {
  try {
    // Fetch sticker set details
    const response = await axios.get(`${TELEGRAM_API_URL}/getStickerSet`, {
      params: {
        name: stickerPackName,
      },
    });

    const stickerSet = response.data.result;
    const fileIds = stickerSet.stickers.map(sticker => sticker.file_id);

    // Ensure the output directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    // Download each sticker
    for (const fileId of fileIds) {
      const fileResponse = await axios.get(`${TELEGRAM_API_URL}/getFile`, {
        params: {
          file_id: fileId,
        },
      });

      const filePath = fileResponse.data.result.file_path;
      const stickerUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
      const stickerResponse = await axios.get(stickerUrl, {
        responseType: 'arraybuffer',
      });

      const stickerFilename = path.basename(filePath);
      fs.writeFileSync(path.join(outputDir, stickerFilename), stickerResponse.data);
    }

    console.log('Stickers downloaded successfully!');
  } catch (error) {
    console.error('Error downloading sticker pack images:', error);
  }
};

void downloadStickerPackImages();
