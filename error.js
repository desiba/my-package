const path = require('path')
const yaml = require('js-yaml');
const fs = require('fs')
const inputfile = path.join(__dirname, './error_bank.json');
const jsonObj = fs.readFileSync(inputfile);

function getErrorObject(code){
  for(let obj in jsonObj){
    if(code === obj) return  { code, message: jsonObj[obj]['message']['eng'] }
  }
}

class Exception extends Error {

    constructor(code = null, message = 'Something went wrong') {
      super()
      this.setCode(code);
      this.message = message;
    }

    getCode(){
      return this.code
    }

    setCode(statusCode){
      this.code = statusCode;
    }

    get message(){
      return this._message;
    }

    set message(newMsg){
      let errorObj = getErrorObject(this.code);
      if(errorObj === undefined){
        this._message = newMsg
      }else{
        this._message = errorObj['message']
      }
    }

  }

  module.exports = {
    Exception
  }