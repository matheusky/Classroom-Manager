// classroom -> Google Classroom
// googleSDK -> Google ADM

async function createCourse() {
  clearConsole();
  setConsole("Iniciando...");
  const file = document.getElementById("incCourses").files[0];
  var extension = file.name.split('.').pop();
  if (extension == "xlsx") {
    var workbook = XLSX.readFile(file.path);
    var sheet_name_list = workbook.SheetNames;
    var planilhaJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    setConsole("Planilha XLSX Carregada...");
  };
  if (extension == "csv") {
    var planilhaJson = csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
    setConsole("Planilha CSV Carregada...");
  };

  for (let i = 0; i < planilhaJson.length; i++) {

    await classroom.courses.create({
      "resource": {
        "ownerId": "me",
        "name": planilhaJson[i].nome,
        "section": planilhaJson[i].section,
        "courseState": "ACTIVE"
      }
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Sala ${planilhaJson[i].nome} Criada!`);
      setConsole(`Progresso:${i + 1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
      function (err) {
        setConsole(`Erro na linha ${i}:`);
        setConsole(err);
        console.error("Execute error", err);
      });
  };
};

async function joinTeatcher() {
  clearConsole();
  setConsole("Iniciando...");
  var dts = document.getElementById("dts").checked;
  var dt = [];
  const file = document.getElementById("incTeachers").files[0];
  var extension = file.name.split('.').pop();
  if (extension == "xlsx") {
    var workbook = XLSX.readFile(file.path);
    var sheet_name_list = workbook.SheetNames;
    var planilhaJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    setConsole("Planilha XLSX Carregada...");
  };
  if (extension == "csv") {
    var planilhaJson = csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
    setConsole("Planilha CSV Carregada...");
  };

  for (let i = 0; i < planilhaJson.length; i++) {
    await classroom.courses.teachers.create({
      "courseId": planilhaJson[i].id,
      "resource": {
        "userId": planilhaJson[i].email
      }
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Professor ${planilhaJson[i].email} atribuido a sala: ${planilhaJson[i].id}`);
      setConsole(`Progresso ${i + 1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
      function (err) {
        setConsole(`Erro na linha ${i}:`);
        setConsole(`${planilhaJson[i].email}, ${err}`);
        //console.error("Execute error", err);
        if (dts == true) {
          var obj = {
            "courseId": planilhaJson[i].id,
            "userId": planilhaJson[i].email,
            "Erro": err
          };
          dt.push(obj);
        }
      });
  };
  if (dts == true) {
    const dataCSV = csvjson.toCSV(dt, options);
    const pathCSV = path.join(__dirname, '../csvs/tmp/ErrosCSV.csv');
    fs.writeFileSync(pathCSV, dataCSV);
    document.getElementById('down').href = pathCSV;
    document.getElementById('downloadGen').style.display = "block";
  };
};

async function joinStudents() {
  clearConsole();
  setConsole("Iniciando...");
  var dts = document.getElementById("dts").checked;
  var dt = [];
  const file = document.getElementById("incStudents").files[0];
  var extension = file.name.split('.').pop();
  if (extension == "xlsx") {
    var workbook = XLSX.readFile(file.path);
    var sheet_name_list = workbook.SheetNames;
    var planilhaJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    setConsole("Planilha XLSX Carregada...");
  };
  if (extension == "csv") {
    var planilhaJson = csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
    setConsole("Planilha CSV Carregada...");
  };

  for (let i = 0; i < planilhaJson.length; i++) {

    await classroom.courses.students.create({
      "courseId": planilhaJson[i].id,
      "resource": {
        "userId": planilhaJson[i].email
      }
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Usuario ${planilhaJson[i].email} inserido a sala ${planilhaJson[i].id}`);
      setConsole(`Progresso ${i + 1} de ${planilhaJson.length}`);
      //console.log("Response", response.result);
    },
      function (err) {
        setConsole(`Erro na linha ${i}:`);
        setConsole(`${planilhaJson[i].email}, ${err}`);
        //console.error("Execute error", err);
        //console.log(dts);
        if (dts == true) {
          var obj = {
            "courseId": planilhaJson[i].id,
            "userId": planilhaJson[i].email,
            "Erro": err
          };
          dt.push(obj);
        };
      });
  };
  if (dts == true) {
    const dataCSV = csvjson.toCSV(dt, options);
    const pathCSV = path.join(__dirname, '../csvs/tmp/ErrosCSV.csv');
    fs.writeFileSync(pathCSV, dataCSV);
    document.getElementById('down').href = pathCSV;
    document.getElementById('downloadGen').style.display = "block";
  };
};

async function ArchiveCourses() {
  clearConsole();
  setConsole("Iniciando...");
  const list = await classroom.courses.list({});
  const data = list.data.courses;

  for (let i = 0; i < data.length; i++) {
    await classroom.courses.update({
      "id": data[i].id,
      "resource": {
        "name": data[i].name,
        "courseState": "ARCHIVED"
      }
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Sala ${data[i].name} foi arquivada!`);
      setConsole(`Progresso:${i + 1} de ${data.length}`);
      console.log("Response", response.result);
    },
      function (err) {
        setConsole(`Erro ao alterar sala ${data[i].name}:`)
        setConsole(err);
        console.error("Execute error", err);
      });
  };
};