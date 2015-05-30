var fs = require('fs');

var filename = process.argv[2];
var fileData = JSON.parse(fs.readFileSync(filename, 'utf8'));

//Extract just the map array from the json file.
var mapArray = fileData.layers[0].data,
newMap = [],
ix = 0;

//Convert to game format by subtracting one from each number
//and 0 becomes 9, but Leave 10 as 10.
for (ix = 0; ix < mapArray.length; ix += 1) {
  newMap[ix] = mapArray[ix] - 1;
  if (newMap[ix] === 9) {
    newMap[ix] = 10; //put it back to 10
  }
  if (newMap[ix] < 0) {
    newMap[ix] = 9;
  }
}

var outputMap = JSON.stringify(newMap);
console.log(outputMap);
