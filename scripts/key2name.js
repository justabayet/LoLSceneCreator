const fs = require("fs");
const path = require("path");

const dataFile = "champions.json";
const key2idFile = "key2id.json";
const outputFile = "key2data.json";

const dataPath = path.join(__dirname, dataFile);
const key2idPath = path.join(__dirname, key2idFile);
const outputPath = path.join(__dirname, outputFile);

function writeFile(filePath, content) {
  const jsonString = JSON.stringify(content, null, 2);

  fs.writeFile(filePath, jsonString, "utf8", (err) => {
    if (err) {
      console.error(`Error writing file: ${err.message}`);
    } else {
      console.log("New JSON file has been created successfully.");
    }
  });
}

fs.readFile(dataPath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }

  try {
    const dataChampions = JSON.parse(data).data;

    fs.readFile(key2idPath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err.message}`);
        return;
      }

      try {
        const key2id = JSON.parse(data);

        const key2data = {};

        Object.values(key2id).forEach((champId) => {
          const { id, key, name, title, skins } = dataChampions[champId];
          key2data[key] = { id, key, name, title, skins };
        });

        console.log(key2data);

        writeFile(outputPath, key2data);
      } catch (parseError) {
        console.error(`Error parsing JSON: ${parseError.message}`);
      }
    });
  } catch (parseError) {
    console.error(`Error parsing JSON: ${parseError.message}`);
  }
});
