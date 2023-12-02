const fs = require("fs");
const path = require("path");

// Specify the path to the sibling JSON file
const filePath = path.join(__dirname, "champions.json");

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    const keysToInternalName = jsonData.keys;

    Object.values(keysToInternalName).map((championInternalName) => {
      console.log(jsonData.data[championInternalName].name);
    });

    // Do something with the JSON data
    console.log("Contents of sibling.json:", jsonData.keys);
  } catch (parseError) {
    console.error(`Error parsing JSON: ${parseError.message}`);
  }
});
