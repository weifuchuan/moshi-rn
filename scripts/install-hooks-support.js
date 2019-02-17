const fs = require("fs");

let files = fs.readdirSync("for-hooks/oss/");

console.log("copy files:", files);

for (let file of files) {
  fs.copyFileSync(
    "for-hooks/oss/" + file,
    "node_modules/react-native/Libraries/Renderer/oss/" + file
  );
}

files = fs.readdirSync("for-hooks/shims/");

console.log("copy files:", files);

for (let file of files) {
  fs.copyFileSync(
    "for-hooks/shims/" + file,
    "node_modules/react-native/Libraries/Renderer/shims/" + file
  );
}
