import path = require("path");
import fs = require("fs");
import Moralis from "../_shared/moralis";
const basePath = path.dirname(process.execPath);
const imagesDir = `${basePath}/generated/images`;

// read json data
const rawData = fs.readFileSync(`${basePath}/generated/json/_metadata.json`);
const data = JSON.parse(rawData.toString());

const uploadMetadata = async () => {
  for (const edition of data) {
    const image = fs.createReadStream(
      path.resolve(imagesDir, `${edition.edition}.png`)
    );

    const file = new Moralis.File(edition.edition, image.read());
    await file.saveIPFS();

    const metadata = new Moralis.Object("Metadata");
    metadata.set("edition", edition.edition);
    metadata.set("image", file);
    await metadata.save();
  }
};

uploadMetadata();
