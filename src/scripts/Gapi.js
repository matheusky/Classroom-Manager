const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

//-----console-frontend
function setConsole(text) {
  document.getElementById("consol").value += text +' \n';
  document.getElementById("consol").scrollTop = document.getElementById("consol").scrollHeight;
};
function clearConsole() {
  document.getElementById("consol").value ='';
}
//------------------

//-------Time-await
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
//------------

//--------Google Auth
const TOKEN_PATH = path.join(__dirname, "../tokens/tokens.json");
const CREDENTIALS_PATH = path.join( __dirname, "../tokens/credentials.json");
const credentialsFile = fs.readFileSync(CREDENTIALS_PATH,"utf-8");
const tokenFile = fs.readFileSync(TOKEN_PATH,"utf-8");
const credentials = JSON.parse(credentialsFile);
const token = JSON.parse(tokenFile);
const {client_secret, client_id, redirect_uris} = credentials.installed;
var oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(token);
const auth = oAuth2Client;
const classroom = google.classroom({version: 'v1', auth});
//---------------

//----Functions

//-----Index page Checker
function loader() {
  if (fs.existsSync(TOKEN_PATH)) {
    document.getElementById('alertChecker').style.display = "none";
  };
};
//---------------------

//---Listagens----
function listCourses() {
  clearConsole();
  setConsole("Carregando...");
  classroom.courses.list({
  }, (err, res) => {
    clearConsole();
    if (err) return setConsole(`Erro:\n${err}`);
    const courses = res.data.courses;
    if (courses && courses.length) {
      setConsole('Listagem:');
      courses.forEach((course) => {
        setConsole(`Sala: ${course.name}`);
      });
    } else {
      setConsole('Nenhuma sala encontrada.');
    }
  });
  
};

function listIDs() {
  clearConsole();
  setConsole("Carregando...");
  
  classroom.courses.list({
  }, (err, res) => {
    clearConsole();
    if (err) return setConsole(`A API retornou um erro: ${err}`);
    const courses = res.data.courses;
    if (courses && courses.length) {
      setConsole('Listagem:');
      courses.forEach((course) => {
        setConsole(`ID: ${course.id}  =  ${course.name}`);
      });
    } else {
      setConsole('Nenhuma sala encontrada.');
    }
  });
  
};

async function listAllStudents() {
  clearConsole();
  setConsole("Iniciando...");
  const list = await classroom.courses.list({});
  const data = list.data.courses;
  var students = [];
  
  if (data == undefined) {
    return setConsole("Nenhuma sala encontrada.");
  } else {
    setConsole("Isso pode demorar alguns segundos...");
    for(let i=0; i<data.length;i++){
      students.push(await classroom.courses.students.list({"courseId": data[i].id }));
      setConsole(`Analisando salas ${i+1} de ${data.length}`);
    };
  };
  clearConsole();
  for (let o = 0; o < students.length; o++) {
    setConsole(`Sala: ${data[o].name}`);
    try {
      for (let p = 0; p < students[o].data.students.length; p++) {
        setConsole(students[o].data.students[p].profile.name.fullName);
        await sleep(100);
      };
    } catch (error) {
      setConsole("Vazia.");
    };
    await sleep(50);
  };
  
};

async function listAllTeatcher() {
  clearConsole();
  setConsole("Iniciando...");
  const list = await classroom.courses.list({});
  const data = list.data.courses;
  var teachers = [];
  
  if (data == undefined) {
    return setConsole("Nenhuma sala encontrada.");
  } else {
    setConsole("Isso pode demorar alguns segundos...");
    for(let i=0; i<data.length;i++){
      teachers.push(await classroom.courses.teachers.list({"courseId": data[i].id }));
      setConsole(`Analisando salas ${i+1} de ${data.length}`);
    };
  };
  clearConsole();
  for (let o = 0; o < teachers.length; o++) {
    setConsole(`Sala: ${data[o].name} Section:${data[o].section}`);
    try {
      for (let p = 0; p < teachers[o].data.teachers.length; p++) {
        setConsole(teachers[o].data.teachers[p].profile.name.fullName);
        await sleep(100);
      };
    } catch (error) {
      setConsole(error);
    };
    await sleep(50);
  };
  
}
//-----------

//--CSVs------

async function createCSV() {
  document.getElementById('downloadGen').style.display="none";
  clearConsole();
  setConsole("Iniciando...");
  const csvjson = require('csvjson');
  setConsole("Gerando planilha...");
  const pathCSV = path.join(__dirname,'../csvs/tmp/CoursesCSV.csv');

  const list = await classroom.courses.list({});

  var options = {
    delimiter: ",", //<String> optional default value is ","
    wrap: true, //<String|Boolean> optional default value is false
    headers: "key", //<String> optional supported values are "full", "none", "relative", "key"
    objectDenote: ".", //<String> optional default value is "."
    arrayDenote: "[]" //<String> optional default value is "[]"
  };

const dataCSV = csvjson.toCSV(list.data, options);

fs.writeFileSync(pathCSV, dataCSV);

document.getElementById('down').href = pathCSV

document.getElementById('downloadGen').style.display="block";

clearConsole();  

setTimeout(()=>{
  fs.unlinkSync(pathCSV);
  document.getElementById('downloadGen').style.display="none";
},15000);
};

async function CSVTeachers() {
  document.getElementById('downloadGen').style.display="none";

  clearConsole();
  setConsole("Iniciando...");
  const csvjson = require('csvjson');
  const list = await classroom.courses.list({});
  const data = list.data.courses;
  var teachers = [];
  
    for(let i=0; i<data.length;i++){
      var lt = await classroom.courses.teachers.list({"courseId": data[i].id });

      if (lt.data.teachers == undefined) {
        lt.data.teachers = [];
      };

      for (let p = 0; p < lt.data.teachers.length; p++) {

        var tmp = {
          "SalaID": data[i].id,
          "SalaName": data[i].name,
          "ProfID": lt.data.teachers[p].userId,
          "ProfName": lt.data.teachers[p].profile.name.fullName
        };
        teachers.push(tmp);
      }
      setConsole(`Analisando salas ${i+1} de ${data.length}`);
    };

  clearConsole();
  setConsole("Gerando planilha...");
  const pathCSV = path.join(__dirname,'../csvs/tmp/CoursesCSV.csv');
  var options = {
    delimiter: ",", //<String> optional default value is ","
    wrap: true, //<String|Boolean> optional default value is false
    headers: "key", //<String> optional supported values are "full", "none", "relative", "key"
    objectDenote: ".", //<String> optional default value is "."
    arrayDenote: "[]" //<String> optional default value is "[]"
  };

  const dataCSV = csvjson.toCSV(teachers, options);

  fs.writeFileSync(pathCSV, dataCSV);

  document.getElementById('down').href = pathCSV
  
  document.getElementById('downloadGen').style.display="block";
  
  clearConsole();  
  
  setTimeout(()=>{
    fs.unlinkSync(pathCSV);
    document.getElementById('downloadGen').style.display="none";
  },15000);
    
  
};

async function CSVStudents() {
  document.getElementById('downloadGen').style.display="none";

  clearConsole();
  setConsole("Iniciando...");
  const csvjson = require('csvjson');
  const list = await classroom.courses.list({});
  const data = list.data.courses;
  var students = [];
  
    for(let i=0; i<data.length;i++){
      var lt = await classroom.courses.students.list({"courseId": data[i].id });

      if (lt.data.students == undefined) {
        lt.data.students = [];
      };

      for (let p = 0; p < lt.data.students.length; p++) {

        var tmp = {
          "SalaID": data[i].id,
          "SalaName": data[i].name,
          "AlunoID": lt.data.students[p].userId,
          "AlunoName": lt.data.students[p].profile.name.fullName
        };
        students.push(tmp);
      }
      setConsole(`Analisando salas ${i+1} de ${data.length}`);
    };

  clearConsole();
  setConsole("Gerando planilha...");
  const pathCSV = path.join(__dirname,'../csvs/tmp/CoursesCSV.csv');
  var options = {
    delimiter: ",", //<String> optional default value is ","
    wrap: true, //<String|Boolean> optional default value is false
    headers: "key", //<String> optional supported values are "full", "none", "relative", "key"
    objectDenote: ".", //<String> optional default value is "."
    arrayDenote: "[]" //<String> optional default value is "[]"
  };

  const dataCSV = csvjson.toCSV(students, options);

  fs.writeFileSync(pathCSV, dataCSV);

  document.getElementById('down').href = pathCSV
  
  document.getElementById('downloadGen').style.display="block";
  
  clearConsole();  
  
  setTimeout(()=>{
    fs.unlinkSync(pathCSV);
    document.getElementById('downloadGen').style.display="none";
  },15000);
    
  
};

async function CSVCourses() {
  document.getElementById('downloadGen').style.display="none";
  clearConsole();
  setConsole("Iniciando...");
  const csvjson = require('csvjson');
  const list = await classroom.courses.list({});
  const data = list.data.courses;
  var couses = [];
  
  for(let i=0; i<data.length;i++){
    var tmp = {
        "id": data[i].id,
        "name": data[i].name,
        "section": data[i].section,
        "courseState": data[i].courseState,
        "description": data[i].description,
        "descriptionHeading": data[i].descriptionHeading,
        "room": data[i].room,
        "LastUpdate": data[i].updateTime
      };
      couses.push(tmp);
      setConsole(`Analisando salas ${i+1} de ${data.length}`);
      await sleep(35);
  };

  setConsole("Gerando planilha...");
  const pathCSV = path.join(__dirname,'../csvs/tmp/CoursesCSV.csv');
  var options = {
    delimiter: ",", //<String> optional default value is ","
    wrap: true, //<String|Boolean> optional default value is false
    headers: "key", //<String> optional supported values are "full", "none", "relative", "key"
    objectDenote: ".", //<String> optional default value is "."
    arrayDenote: "[]" //<String> optional default value is "[]"
  };

  const dataCSV = csvjson.toCSV(couses, options);

  fs.writeFileSync(pathCSV, dataCSV);

  document.getElementById('down').href = pathCSV
  
  document.getElementById('downloadGen').style.display="block";
  
  setTimeout(()=>{
    fs.unlinkSync(pathCSV);
    document.getElementById('downloadGen').style.display="none";
  },15000);
    
  
};

//------------


//--Includes---
async function createCourse() {
  clearConsole();
  setConsole("Iniciando...");
  const csvToJson = require('convert-csv-to-json');
  const file = document.getElementById("incCourses").files[0];
  var planilhaJson = await csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
  for(let i=0; i<planilhaJson.length;i++){

    if (planilhaJson[i].courseState == undefined) {
      planilhaJson[i].courseState = "";
    };

    if (planilhaJson[i].description == undefined) {
      planilhaJson[i].description = "";
    };

    if (planilhaJson[i].descriptionHeading == undefined) {
      planilhaJson[i].descriptionHeading = "";
    };

    if (planilhaJson[i].name == undefined) {
      planilhaJson[i].name = "";
    };

    if (planilhaJson[i].section == undefined) {
      planilhaJson[i].section = "";
    };

    if (planilhaJson[i].room == undefined) {
      planilhaJson[i].room = "";
    };
    await classroom.courses.create({
      "resource": {
        "ownerId":"me",
        "courseState": planilhaJson[i].courseState,
        "description": planilhaJson[i].description,
        "descriptionHeading": planilhaJson[i].descriptionHeading,
        "name": planilhaJson[i].name,
        "room": planilhaJson[i].room,
        "section": planilhaJson[i].section
      }
    }).then(function(response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Sala ${planilhaJson[i].name} Criada!`);
      setConsole(`Progresso:${i+1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
    function(err) {
      setConsole(`Erro na linha ${i}:`);
      setConsole(err);
      console.error("Execute error", err);
    });
  };
};

async function attCourse() {
  clearConsole();
  setConsole("Iniciando...");
  const csvToJson = require('convert-csv-to-json');
  const file = document.getElementById("incCourses").files[0];
  var planilhaJson = await csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
  for(let i=0; i<planilhaJson.length;i++){

    if (planilhaJson[i].courseState == undefined) {
      planilhaJson[i].courseState = "";
    };

    if (planilhaJson[i].description == undefined) {
      planilhaJson[i].description = "";
    };

    if (planilhaJson[i].descriptionHeading == undefined) {
      planilhaJson[i].descriptionHeading = "";
    };

    if (planilhaJson[i].name == undefined) {
      planilhaJson[i].name = "";
    };

    if (planilhaJson[i].section == undefined) {
      planilhaJson[i].section = "";
    };

    if (planilhaJson[i].room == undefined) {
      planilhaJson[i].room = "";
    };

    await classroom.courses.update({
      "id": planilhaJson[i].id,
        "resource": {
        "courseState": planilhaJson[i].courseState,
        "description": planilhaJson[i].description,
        "descriptionHeading": planilhaJson[i].descriptionHeading,
        "name": planilhaJson[i].name,
        "room": planilhaJson[i].room,
        "section": planilhaJson[i].section
      }
    }).then(function(response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Sala ${planilhaJson[i].name} atualizada!`);
      setConsole(`Progresso:${i+1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
    function(err) {
      setConsole(`Erro na linha ${i}:`);
      setConsole(err);
      console.error("Execute error", err);
    });
  };
};

async function joinTeatcher() {
  clearConsole();
  setConsole("Iniciando...");
  const csvToJson = require('convert-csv-to-json');
  const file = document.getElementById("incTeachers").files[0];
  const planilhaJson = await csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);

  for(let i=0; i<planilhaJson.length; i++){
    await classroom.courses.teachers.create({
      "courseId": planilhaJson[i].id,
      "resource": {
        "userId": planilhaJson[i].email
      }
    }).then(function(response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Professor ${planilhaJson[i].email} atribuido a sala: ${planilhaJson[i].id}`);
      setConsole(`Progresso ${i+1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
    function(err) {
      setConsole(`Erro na linha ${i}:`);
      setConsole(err);
      console.error("Execute error", err);
    });
  };
};

async function joinStudents() {
  clearConsole();
  setConsole("Iniciando...");
  const csvToJson = require('convert-csv-to-json');
  const file = document.getElementById("incStudents").files[0];
  const planilhaJson = await csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
  
  for(let i=0; i<planilhaJson.length; i++){

    await classroom.courses.students.create({
      "courseId": planilhaJson[i].id,
      "resource": {
        "userId": planilhaJson[i].email
      }
    }).then(function(response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Usuario ${planilhaJson[i].email} inserido a sala ${planilhaJson[i].id}`);
      setConsole(`Progresso ${i+1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
    function(err) {
      setConsole(`Erro na linha ${i}:`);
      setConsole(err);
      console.error("Execute error", err);
    });
  };
};

async function ArchiveCourses() {
  clearConsole();
  setConsole("Iniciando...");
  const list = await classroom.courses.list({});
  const data = list.data.courses;

  for(let i=0; i<data.length;i++){
    await classroom.courses.update({
      "id": data[i].id,
      "resource": {
        "name": data[i].name,
        "courseState": "ARCHIVED"
      }
    }).then(function(response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Sala ${data[i].name} foi arquivada!`);
      setConsole(`Progresso:${i+1} de ${data.length}`);
      console.log("Response", response.result);
    },
    function(err) {
      setConsole(`Erro ao alterar sala ${data[i].name}:`)
      setConsole(err);
      console.error("Execute error", err);
    });
  };
};
//--------------

//---Deletes-------
async function deleteAllCourses() {
  clearConsole();
  setConsole("Iniciando...");
  const list = await classroom.courses.list({});
  const data = list.data.courses;

  for(let i=0; i<data.length;i++){
    await classroom.courses.delete({
      "id": data[i].id
    }).then(function(response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Sala ${data[i].name} excluida!`);
      setConsole(`Progresso:${i} de ${data.length}`);
      console.log("Response", response.result);
    },
    function(err) {
      setConsole(`Erro ao excluir sala ${data[i].name}:`)
      setConsole(err);
      console.error("Execute error", err);
    });
  };
};

async function deleteCourses() {
  clearConsole();
  setConsole("Iniciando...");
  const csvToJson = require('convert-csv-to-json');
  const file = document.getElementById("delCourses").files[0];
  const planilhaJson = await csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);

  for(let i=0; i<planilhaJson.length;i++){
    await classroom.courses.delete({
      "id": planilhaJson[i].id
    }).then(function(response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Sala ${planilhaJson[i].id} excluida!`);
      setConsole(`Progresso:${i+1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
    function(err) {
      setConsole(`Erro na linha ${i}:`);
      setConsole(err);
      console.error("Execute error", err);
    });
  };
};

async function deleteTeatcher(){
  clearConsole();
  setConsole("Iniciando...");
  const csvToJson = require('convert-csv-to-json');
  const file = document.getElementById("delTeachers").files[0];
  const planilhaJson = await csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);

  for(let i=0; i<planilhaJson.length; i++){
    await classroom.courses.teachers.delete({
      "courseId": planilhaJson[i].id,
      "userId": planilhaJson[i].email
    }).then(function(response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Professor ${planilhaJson[i].email} removido da sala ${planilhaJson[i].id}`);
      setConsole(`Progresso ${i+1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
    function(err) {
      setConsole(`Erro na linha ${i}:`);
      setConsole(err);
      console.error("Execute error", err);
    });
  };
};

async function deleteStudents(){
  clearConsole();
  setConsole("Iniciando...");
  const csvToJson = require('convert-csv-to-json');
  const file = document.getElementById("delStudents").files[0];
  const planilhaJson = await csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);

  for(let i=0; i<planilhaJson.length; i++){
    await classroom.courses.teachers.delete({
      "courseId": planilhaJson[i].id,
      "userId": planilhaJson[i].email
    }).then(function(response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Aluno ${planilhaJson[i].email} removido da sala ${planilhaJson[i].id}`);
      setConsole(`Progresso ${i+1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
    function(err) {
      setConsole(`Erro na linha ${i}:`);
      setConsole(err);
      console.error("Execute error", err);
    });
  };
};