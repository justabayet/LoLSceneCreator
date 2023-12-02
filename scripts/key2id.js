const fs = require("fs");
const path = require("path");

const inputFile = "champions.json";
const availableIndexesFile = "index2name.json";
const key2idFile = "key2id.json";
const id2keyFile = "id2key.json";

const inputPath = path.join(__dirname, inputFile);
const availableIndexesPath = path.join(__dirname, availableIndexesFile);
const key2idPath = path.join(__dirname, key2idFile);
const id2keyPath = path.join(__dirname, id2keyFile);

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

// Read the JSON file
fs.readFile(inputPath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    const key2id_full = jsonData.keys;

    fs.readFile(availableIndexesPath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err.message}`);
        return;
      }

      try {
        const key2id_chinese = JSON.parse(data);

        console.log(jsonData, key2id_full);

        const key2id = {};
        Object.keys(key2id_chinese).forEach(
          (id) => (key2id[id] = key2id_full[id])
        );

        console.log(key2id);

        writeFile(key2idPath, key2id);

        const id2key = {};

        Object.keys(key2id).forEach((id) => (id2key[key2id[id]] = id));
        writeFile(id2keyPath, id2key);

        // const key2id_full = jsonData.keys;
      } catch (parseError) {
        console.error(`Error parsing JSON: ${parseError.message}`);
      }
    });
  } catch (parseError) {
    console.error(`Error parsing JSON: ${parseError.message}`);
  }
});
