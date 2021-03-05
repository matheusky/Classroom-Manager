// classroom -> Google Classroom
// googleSDK -> Google ADM

async function listCourses() {
  clearConsole();
  setConsole("Carregando...");
  var type = document.getElementById("stats").value;
  await classroom.courses.list({
    "courseStates": type
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

async function listIDs() {
  clearConsole();
  setConsole("Carregando...");
  var type = document.getElementById("stats2").value;
  await classroom.courses.list({
    "courseStates": type
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
    for (let i = 0; i < data.length; i++) {
      students.push(await classroom.courses.students.list({ "courseId": data[i].id }));
      setConsole(`Analisando salas ${i + 1} de ${data.length}`);
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
    for (let i = 0; i < data.length; i++) {
      teachers.push(await classroom.courses.teachers.list({ "courseId": data[i].id }));
      setConsole(`Analisando salas ${i + 1} de ${data.length}`);
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

async function CouseDetails() {
  var idCourse = document.getElementById("Gcourse").value;

  if (idCourse == "") {
    document.getElementById("Gcourse").value = "Digite uma ID";
  } else {
    document.getElementById("Cprof").value = "Carregando...";
    document.getElementById("Calun").value = "Carregando...";

    //---DetailsCourse-------
    await classroom.courses.get({
      "id": idCourse
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      // console.log("Response", response);
      document.getElementById("Cname").value = response.data.name;
      document.getElementById("Cstate").value = response.data.courseState;
      document.getElementById("Clink").value = response.data.alternateLink;
      document.getElementById("Ccreate").value = response.data.creationTime;
      document.getElementById("Clastup").value = response.data.updateTime;
      document.getElementById("Cdrive").value = response.data.teacherFolder.alternateLink;
    }, function (err) {
      console.error("Execute error", err);
      document.getElementById("Cname").value = "ID Error";
      document.getElementById("Cstate").value = "ID Error";
      document.getElementById("Clink").value = "ID Error";
      document.getElementById("Ccreate").value = "ID Error";
      document.getElementById("Clastup").value = "ID Error";
      document.getElementById("Cdrive").value = "ID Error";
    });

    //---DetailsCourseTeachers-------
    await classroom.courses.teachers.list({
      "courseId": idCourse
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      // console.log("Response", response);
      if (response.data.teachers && response.data.teachers.length) {
        document.getElementById("Cprof").value = "";
        response.data.teachers.forEach((teachers) => {
          document.getElementById("Cprof").value += `${teachers.profile.name.fullName}` + ' \n';
          document.getElementById("Cprof").scrollTop = document.getElementById("Cprof").scrollHeight;
        });
      } else {
        document.getElementById("Cprof").value = "";
        document.getElementById("Cprof").value = "Nenhum Professor na sala...";
      };
    }, function (err) {
      console.error("Execute error", err);
      document.getElementById("Cprof").value = "";
      document.getElementById("Cprof").value = err;
    });

    //---DetailsCourseStudent
    await classroom.courses.students.list({
      "courseId": idCourse
    })
      .then(function (response) {
        // Handle the results here (response.result has the parsed body).
        // console.log("Response", response);
        if (response.data.students && response.data.students.length) {
          document.getElementById("Calun").value = "";
          response.data.students.forEach((students) => {
            document.getElementById("Calun").value += `${students.profile.name.fullName}` + ' \n';
            document.getElementById("Calun").scrollTop = document.getElementById("Calun").scrollHeight;
          });
        } else {
          document.getElementById("Calun").value = "";
          document.getElementById("Calun").value = "Nenhum Professor na sala...";
        };
      },
        function (err) {
          console.error("Execute error", err);
          document.getElementById("Calun").value = "";
          document.getElementById("Calun").value = err;
        });
  };
};

async function getStudent() {
  const aluno = document.getElementById('alun').value;
  if (aluno == "" ||aluno == undefined ) {
    setConsole("Digite um email valido")
  } else {
    await classroom.courses.list({
      "studentId": aluno
    }, (err, res) => {
      clearConsole();
      if (err) return setConsole(`Erro:${err.message}`);
      const courses = res.data.courses;
      if (courses && courses.length) {
        courses.forEach((course) => {
          setConsole(`Sala: ${course.name}`);
          setConsole(`Id: ${course.id}`);
          setConsole(`Estado: ${course.courseState}`);
          setConsole(`Link: ${course.alternateLink}`);
          setConsole("-----------------------------------------------------");
        });
      } else {
        setConsole('Nenhuma sala encontrada.');
      }
    });

  }
};

async function getTeatcher() {
  const teacher = document.getElementById('prof').value;
  if (teacher == "" ||teacher == undefined ) {
    setConsole("Digite um email valido")
  } else {
    await classroom.courses.list({
      "teacherId": teacher
    }, (err, res) => {
      clearConsole();
      if (err) return setConsole(`Erro:${err.message}`);
      const courses = res.data.courses;
      if (courses && courses.length) {
        courses.forEach((course) => {
          setConsole(`Sala: ${course.name}`);
          setConsole(`Id: ${course.id}`);
          setConsole(`Estado: ${course.courseState}`);
          setConsole(`Link: ${course.alternateLink}`);
          setConsole("-----------------------------------------------------");
        });
      } else {
        setConsole('Nenhuma sala encontrada.');
      }
    });

  }
};