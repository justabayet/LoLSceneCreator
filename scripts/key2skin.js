const fs = require("fs");
const path = require("path");

const index2skinFile = "index2skin.json";
const key2dataFile = "key2data.json";
const key2skinFile = "key2skin.json";

const index2skinPath = path.join(__dirname, index2skinFile);
const key2dataPath = path.join(__dirname, key2dataFile);
const key2skinPath = path.join(__dirname, key2skinFile);

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

fs.readFile(index2skinPath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }

  try {
    const skins_chinese = JSON.parse(data);

    console.log(skins_chinese);
    fs.readFile(key2dataPath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err.message}`);
        return;
      }

      try {
        const dataChampions = JSON.parse(data);

        const key2skin = {};

        Object.keys(skins_chinese).forEach((champId) => {
          const { name, skins } = dataChampions[champId];
          console.log(name, skins.length, skins_chinese[champId].length);
          key2skin[champId] = skins
            .slice(0, skins_chinese[champId].length)
            .map((skinData) => skinData.name);
        });

        writeFile(key2skinPath, key2skin);
      } catch (parseError) {
        console.error(`Error parsing JSON: ${parseError.message}`);
      }
    });
  } catch (parseError) {
    console.error(`Error parsing JSON: ${parseError.message}`);
  }
});
