const yaml = require('js-yaml');
const fs = require('fs')
const crypto = require('crypto');
const path = require('path')
const jsonPathFile = path.join(__dirname, './error_bank.json')

const Exception = require( path.resolve( __dirname, "./error.js" ) );

let jsonFile = fs.readFileSync(jsonPathFile);
jsonFile = JSON.parse(jsonFile);

const fileContent = fs.readFileSync(path.join(__dirname, 'loaded_hashed_file.txt')).toString().split("\n");

const generateChecksum = (str, algorithm, encoding) => {
    return crypto.createHash(algorithm || 'md5').update(str, 'utf8').digest(encoding || 'hex');
};

const config = (option = {}) => {
  if(option.path !== null){
    let parsed = fs.readFileSync(option.path, "utf-8");
    let checksum = generateChecksum(parsed);
    if(!fileContent.includes(checksum)){
      let pathFileJsonObj = yaml.load(parsed);
      for(let obj in pathFileJsonObj){
        if(jsonFile.hasOwnProperty(obj)) delete pathFileJsonObj[obj];
      }
      let newObject = { ...pathFileJsonObj, ...jsonFile };
      fs.writeFileSync(jsonPathFile, JSON.stringify(newObject));
      fs.appendFile(path.join(__dirname, 'loaded_hashed_file.txt'), checksum+"\n");
    }
  }
}


const fetch = (code, lang = 'eng') => {

  //config({ path: path.join(__dirname, 'xyz.yml') });

  const result = {};
  code = (typeof(code) == "number") ? JSON.stringify(code) : code;
  for(let obj in jsonFile){
    if(obj == code){
      result.code = obj
      result.title = jsonFile[obj]['title']
      result.message = jsonFile[obj]['message'][lang]
      break;
    }
  }
  return result;
}

/*
console.log(fetch('3003'))
try{
  throw new Exception('3003');
}catch(error){
  console.log(error.message);
}
*/

module.exports = {
  fetch,
  config,
  Exception
}


