const fs = require('fs');
const content = fs.readFileSync('node_modules/@vladmandic/human/src/helpers/boxes.ts', 'utf8') 
  || fs.readFileSync('node_modules/@vladmandic/human/src/face/face.ts', 'utf8');
console.log(content.slice(0, 500));
