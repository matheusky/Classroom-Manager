const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const csvToJson = require('convert-csv-to-json');
const csvjson = require('csvjson');
const XLSX = require('xlsx');
const { google } = require('googleapis');


//---Vars--------
//CSV Options
var options = {
  delimiter: ",", //<String> optional default value is ","
  wrap: true, //<String|Boolean> optional default value is false
  headers: "key", //<String> optional supported values are "full", "none", "relative", "key"
  objectDenote: ".", //<String> optional default value is "."
  arrayDenote: "[]" //<String> optional default value is "[]"
};

//CSV path
const pathCSV = path.join(__dirname, '../csvs/tmp/tmpPlan.csv');

//Log path
const pathLOG = path.join(__dirname, '../csvs/tmp/log.txt');

//----------------------



//---Index page Checker-
function loader() {
const TOKEN_PATH = path.join(__dirname, "../tokens/tokens.json");
  if (fs.existsSync(TOKEN_PATH)) {
    document.getElementById('alertChecker').style.display = "none";
  };
};
//----------------------

//---console-frontend---
function setConsole(text) {
  document.getElementById("consol").value += text + ' \n';
  document.getElementById("consol").scrollTop = document.getElementById("consol").scrollHeight;
};

function clearConsole() {
  document.getElementById("consol").value = '';
}
//---------------------

//---Log_creator-------
function LogCreator() {
  var log = document.getElementById("consol").value;
  fs.writeFileSync(pathLOG, log);
  document.getElementById('down2').href = pathLOG;
  document.getElementById('downloadGen2').style.display = "block"; 
};
//---------------------

//---Time-await--------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
//---------------------

//---Dl-timeout--------
function dl() {
  setTimeout(() => {
    if (fs.existsSync(pathCSV)) {
      fs.unlinkSync(pathCSV);
    };
    if (fs.existsSync(pathLOG)) {
      fs.unlinkSync(pathLOG);
    };
      location.reload();
  }, 15000);
};

//---Map-Range---------
function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};
//---------------------