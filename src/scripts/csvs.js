// classroom -> Google Classroom
// googleSDK -> Google ADM

async function createCSV() {
  clearConsole();
  setConsole("Iniciando...");
  setConsole("Gerando planilha...");
  
  const list = await classroom.courses.list({});

  const dataCSV = csvjson.toCSV(list.data, options);

  fs.writeFileSync(pathCSV, dataCSV);

  document.getElementById('down').href = pathCSV;
  document.getElementById('down').download = "Planilha geral.csv";
  document.getElementById('downloadGen').style.display = "block";

  clearConsole();
  setConsole("Planilha geral gerada!");

};

async function CSVTeachers() {
  clearConsole();
  setConsole("Iniciando...");
  const list = await classroom.courses.list({});
  const data = list.data.courses;
  var teachers = [];

  for (let i = 0; i < data.length; i++) {
    var lt = await classroom.courses.teachers.list({ "courseId": data[i].id });

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
    setConsole(`Analisando salas ${i + 1} de ${data.length}`);
  };

  clearConsole();
  setConsole("Gerando planilha...");

  const dataCSV = csvjson.toCSV(teachers, options);

  fs.writeFileSync(pathCSV, dataCSV);

  document.getElementById('down').href = pathCSV;
  document.getElementById('down').download = "Planilha de Professores.csv";
  document.getElementById('downloadGen').style.display = "block";

  clearConsole();
  setConsole("Planilha dos professores gerada!");
};

async function CSVStudents() {
  clearConsole();
  setConsole("Iniciando...");
  const list = await classroom.courses.list({});
  const data = list.data.courses;
  var students = [];

  for (let i = 0; i < data.length; i++) {
    var lt = await classroom.courses.students.list({ "courseId": data[i].id });

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
    setConsole(`Analisando salas ${i + 1} de ${data.length}`);
  };

  clearConsole();
  setConsole("Gerando planilha...");

  const dataCSV = csvjson.toCSV(students, options);

  fs.writeFileSync(pathCSV, dataCSV);

  document.getElementById('down').href = pathCSV;
  document.getElementById('down').download = "Planilha de Alunos.csv";
  document.getElementById('downloadGen').style.display = "block";

  clearConsole();
  setConsole("Planilha de Alunos gerada!");
};

async function CSVCourses() {
  clearConsole();
  setConsole("Iniciando...");
  const list = await classroom.courses.list({});
  const data = list.data.courses;
  var couses = [];

  for (let i = 0; i < data.length; i++) {
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
    setConsole(`Analisando salas ${i + 1} de ${data.length}`);
    await sleep(17);
  };

  setConsole("Gerando planilha...");

  const dataCSV = csvjson.toCSV(couses, options);

  fs.writeFileSync(pathCSV, dataCSV);

  document.getElementById('down').href = pathCSV;
  document.getElementById('down').download = "Planilha de salas.csv";
  document.getElementById('downloadGen').style.display = "block";

  clearConsole();
  setConsole("Planilha de salas gerada!");
};