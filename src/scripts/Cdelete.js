// classroom -> Google Classroom
// googleSDK -> Google ADM

async function deleteAllCourses() {
  clearConsole();
  setConsole("Iniciando...");
  const list = await classroom.courses.list({});
  const data = list.data.courses;

  for (let i = 0; i < data.length; i++) {
    await classroom.courses.delete({
      "id": data[i].id
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Sala ${data[i].name} excluida!`);
      setConsole(`Progresso:${i} de ${data.length}`);
      console.log("Response", response.result);
    },
      function (err) {
        setConsole(`Erro ao excluir sala ${data[i].name}:`)
        setConsole(err);
        console.error("Execute error", err);
      });
  };
};

async function deleteArchivedCourses() {
  clearConsole();
  setConsole("Iniciando...");
  const list = await classroom.courses.list({});
  const data = list.data.courses;

  //console.log(data[1].courseState, data[1].name, data[1].id)

  for (let i = 0; i < data.length; i++) {
    if (data[i].courseState == "ARCHIVED") {
      await classroom.courses.delete({
        "id": data[i].id
      }).then(function (response) {
        // Handle the results here (response.result has the parsed body).
        setConsole(`Sala ${data[i].name} excluida!`);
        console.log("Response", response.result);
      },
        function (err) {
          setConsole(`Erro ao excluir sala ${data[i].name}:`)
          setConsole(err);
          console.error("Execute error", err);
        });
    };
    setConsole(`Progresso:${i + 1} de ${data.length}`);
  };
};

async function deleteCourses() {
  clearConsole();
  setConsole("Iniciando...");
  const file = document.getElementById("delCourses").files[0];
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
    await classroom.courses.delete({
      "id": planilhaJson[i].id
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Sala de ID:${planilhaJson[i].id} foi excluida!`);
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

async function deleteTeatcher() {
  clearConsole();
  setConsole("Iniciando...");
  const file = document.getElementById("delTeachers").files[0];
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
    await classroom.courses.teachers.delete({
      "courseId": planilhaJson[i].id,
      "userId": planilhaJson[i].email
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Professor ${planilhaJson[i].email} removido da sala ${planilhaJson[i].id}`);
      setConsole(`Progresso ${i + 1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
      function (err) {
        setConsole(`Erro na linha ${i}:`);
        setConsole(err);
        console.error("Execute error", err);
      });
  };
};

async function deleteStudents() {
  clearConsole();
  setConsole("Iniciando...");
  const file = document.getElementById("delStudents").files[0];
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
    await classroom.courses.students.delete({
      "courseId": planilhaJson[i].id,
      "userId": planilhaJson[i].email
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      setConsole(`Aluno ${planilhaJson[i].email} removido da sala ${planilhaJson[i].id}`);
      setConsole(`Progresso ${i + 1} de ${planilhaJson.length}`);
      console.log("Response", response.result);
    },
      function (err) {
        setConsole(`Erro na linha ${i}:`);
        setConsole(err);
        console.error("Execute error", err);
      });
  };
};