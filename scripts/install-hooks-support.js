const fs = require("fs");

const files = fs.readdirSync("oss-with-hooks");

console.log("copy files:", files);

for (let file of files) {
  fs.copyFileSync(
    "oss-with-hooks/" + file,
    "node_modules/react-native/Libraries/Renderer/oss/" + file
  );
}
