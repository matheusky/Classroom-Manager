// classroom -> Google Classroom
// googleSDK -> Google ADM

async function Gcheck() {
  var email = document.getElementById("GMchecker").value;
  await googleSDK.users.get({
    "userKey": email
  })
    .then(function (response) {
      // Handle the results here (response.result has the parsed body).
      //console.log("Response", response);
      clearConsole();
      setConsole(`Nome: ${response.data.name.fullName}`);
      setConsole("");
      setConsole(`Ultimo login: ${response.data.lastLoginTime}`);
      setConsole("");
      setConsole(`Org Path: ${response.data.orgUnitPath}`);
      setConsole("");
      setConsole(`Arquivado: ${response.data.archived}`);
      setConsole("");
      setConsole(`Suspenso: ${response.data.suspended}`);

    },
      function (err) { setConsole(`Erro: ${err.message}`); });
};

function showopt() {
  if (document.getElementById('domaincheck').checked == true) {
    document.getElementById('domopt').style.display = "block";
  };
  if (document.getElementById('domaincheck').checked == false) {
    document.getElementById('domopt').style.display = "none";
  };
}

//---CreatePlan------
function load() {
  const file = document.getElementById("plandata").files[0];
  var extension = file.name.split('.').pop();
  if (extension == "xlsx") {
    var workbook = XLSX.readFile(file.path);
    var sheet_name_list = workbook.SheetNames;
    var planilhaJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    //console.log("xlsx");
  };
  if (extension == "csv") {
    var planilhaJson = csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
    //console.log("csv");
  };
  const headkeys = Object.getOwnPropertyNames(planilhaJson[0]);

  var select1 = document.getElementById('namecolun');
  var select2 = document.getElementById('emailcolun');
  var select3 = document.getElementById('senhacolun');

  for (let i = 0; i < headkeys.length; i++) {
    //console.log(headkeys[i]);
    var opt = document.createElement('option');
    opt.value = headkeys[i].replace(/"/g, '');
    opt.innerHTML = headkeys[i].replace(/"/g, '');
    select1.appendChild(opt);
  };
  for (let i = 0; i < headkeys.length; i++) {
    //console.log(headkeys[i]);
    var opt = document.createElement('option');
    opt.value = headkeys[i].replace(/"/g, '');
    opt.innerHTML = headkeys[i].replace(/"/g, '');
    select2.appendChild(opt);
  };
  for (let i = 0; i < headkeys.length; i++) {
    //console.log(headkeys[i]);
    var opt = document.createElement('option');
    opt.value = headkeys[i].replace(/"/g, '');
    opt.innerHTML = headkeys[i].replace(/"/g, '');
    select3.appendChild(opt);
  };
  document.getElementById('dlw').style.display = "block";
};

async function process() {
  const file = document.getElementById("plandata").files[0];
  var extension = file.name.split('.').pop();
  if (extension == "xlsx") {
    var workbook = XLSX.readFile(file.path);
    var sheet_name_list = workbook.SheetNames;
    var planilhaJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log("xlsx");
  };
  if (extension == "csv") {
    var planilhaJson = csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
    console.log("csv");
  };
  
  var newPlain = [];
  const select1 = document.getElementById('namecolun').value;
  const select2 = document.getElementById('emailcolun').value;
  const select3 = document.getElementById('senhacolun').value;
  
  const domain = document.getElementById("domopt").value;
  const orgpath = document.getElementById("orgpath").value;
  
  var bar = document.getElementById("Bar");
  var barnm = document.getElementById("barnun");

  for (let i = 0; i < planilhaJson.length; i++) {

    var nametmp = planilhaJson[i][select1].split(" ");

    var tmp = {
      "First Name": nametmp[0],
      "Last Name": nametmp.slice(1, 15).join(' '),
      "Email Address": planilhaJson[i][select2] + domain,
      "Password": planilhaJson[i][select3],
      "Org Unit Path": orgpath,
      "Change Password at Next Sign-In": "true"
    };

    newPlain.push(tmp);

    bar.style.width = Math.round(map_range(i,0,planilhaJson.length,0,100))+"%";
    barnm.innerHTML = Math.round(map_range(i,0,planilhaJson.length,0,100))+"%";
  };

  const dataCSV = csvjson.toCSV(newPlain, options);
  fs.writeFileSync(pathCSV, dataCSV);

  document.getElementById('down').href = pathCSV;
  document.getElementById('down').download = "Planilha de Emails.csv";
  document.getElementById('downloadGen').style.display = "block";

};
//-------------------

async function createEmail() {
  const Ufrname = document.getElementById('Ufname').value;
  const Ultname = document.getElementById('Ulname').value;
  const Ugemail = document.getElementById('Uemail').value;
  const Ugpass = document.getElementById('Upass').value;
  const orgpath = document.getElementById('org').value;

  //console.log(Ufrname, Ultname, Ugemail, Ugpass, orgpath);

  await googleSDK.users.insert({
    "resource": {
      "name": {
        "familyName": Ultname,
        "givenName": Ufrname
      },
      "password": Ugpass,
      "primaryEmail": Ugemail,
      "orgUnitPath": orgpath,
      "changePasswordAtNextLogin": true
    }
  }).then(function (response) {
    // Handle the results here (response.result has the parsed body).
    console.log("Response", response);
    document.getElementById('msg').innerHTML = "Email criado com sucesso!";
  },
    function (err) {
      //console.error("Execute error", err.message);
      window.alert(`Ocorreu um erro:\n\n${err.message}`);
      document.getElementById('msg').innerHTML = "Erro! Revise os dados e tente novamente...";
    });
};

async function createEmails() {
  const file = document.getElementById("plandata").files[0];
  var extension = file.name.split('.').pop();
  if (extension == "xlsx") {
    var workbook = XLSX.readFile(file.path);
    var sheet_name_list = workbook.SheetNames;
    var planilhaJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log("xlsx");
  };
  if (extension == "csv") {
    var planilhaJson = csvToJson.fieldDelimiter(',').getJsonFromCsv(file.path);
    console.log("csv");
  };

  for (let i = 0; i < planilhaJson.length; i++) {
    await googleSDK.users.insert({
      "resource": {
        "name": {
          "familyName": planilhaJson[i].lastname,
          "givenName": planilhaJson[i].firstname
        },
        "password": planilhaJson[i].password,
        "primaryEmail": planilhaJson[i].email,
        "orgUnitPath": planilhaJson[i].orgpath,
        "changePasswordAtNextLogin": true
      }
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      //console.log("Response", response);
      setConsole(`Email ${planilhaJson[i].email} criado...`);
    },
      function (err) {
        //console.error("Execute error", err);
        setConsole(`Email ${planilhaJson[i].email} falhou...`)
      });
  };
};

async function SuspUser() {
  clearConsole();
  setConsole("Iniciando...");
  const file = document.getElementById("Suser").files[0];
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
    await googleSDK.users.update({
      "userKey": planilhaJson[i].email,
      "resource": {
        "suspended": true
      }
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      //console.log("Response", response);
      setConsole("");
      setConsole(`Email:${planilhaJson[i].email}`);
      setConsole(`Nome:${response.data.name.fullName}`);
      setConsole("Foi Suspenso.");
      setConsole("---------------------------------------------");
    },
      function (err) {
        //console.error("Execute error", err);
        setConsole(`Erro:${err.message}`);
      });
  };
};

async function DellUser() {
  clearConsole();
  setConsole("Iniciando...");
  const file = document.getElementById("DellUser").files[0];
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
    await googleSDK.users.delete({
      "userKey": planilhaJson[i].email
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      //console.log("Response", response);
      setConsole("");
      setConsole(`Email:${planilhaJson[i].email}`);
      setConsole(`Nome:${response.data.name.fullName}`);
      setConsole("Foi Excluido.");
      setConsole("---------------------------------------------");
    },
      function (err) {
        //console.error("Execute error", err);
        setConsole(`Erro:${err.message}`);
      });
  };
};

async function susUser() {
  clearConsole();
  email = document.getElementById("sususer").value;
  if (email == "" || email == undefined) {
    setConsole("Foi Digite email valido.");
  } else {
    await googleSDK.users.update({
      "userKey": email,
      "resource": {
        "suspended": true
      }
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      //console.log("Response", response);
      setConsole(`Email:${email}`);
      setConsole(`Nome:${response.data.name.fullName}`);
      setConsole("Foi suspenso.");
      setConsole("---------------------------------------------");
    },
      function (err) {
        //console.error("Execute error", err);
        setConsole(`Erro:${err.message}`);
      });
  };
};

async function freeUser() {
  clearConsole();
  email = document.getElementById("freUser").value;
  if (email == "" || email == undefined) {
    setConsole("Foi Digite email valido.");
  } else {
    await googleSDK.users.update({
      "userKey": email,
      "resource": {
        "suspended": false
      }
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      //console.log("Response", response);
      setConsole(`Email:${email}`);
      setConsole(`Nome:${response.data.name.fullName}`);
      setConsole("Foi liberado.");
      setConsole("---------------------------------------------");
    },
      function (err) {
        //console.error("Execute error", err);
        setConsole(`Erro:${err.message}`);
      });
  };
};

async function freeUsers() {
  clearConsole();
  setConsole("Iniciando...");
  const file = document.getElementById("freeUsers").files[0];
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
    await googleSDK.users.update({
      "userKey": planilhaJson[i].email,
      "resource": {
        "suspended": false
      }
    }).then(function (response) {
      // Handle the results here (response.result has the parsed body).
      //console.log("Response", response);
      setConsole("");
      setConsole(`Email:${planilhaJson[i].email}`);
      setConsole(`Nome:${response.data.name.fullName}`);
      setConsole("Foi Liberado.");
      setConsole("---------------------------------------------");
    },
      function (err) {
        //console.error("Execute error", err);
        setConsole(`Erro:${err.message}`);
      });
  };
};