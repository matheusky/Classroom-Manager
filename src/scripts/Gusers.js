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

  await googleSDK.users.insert({
    "resource": {
      "name": {
        "familyName": Ultname,
        "givenName": Ufrname
      },
      "password": Ugpass,
      "primaryEmail": Ugemail,
      "changePasswordAtNextLogin": true,
      "orgUnitPath": orgpath
    }
  }).then(function (response) {
    // Handle the results here (response.result has the parsed body).
    console.log("Response", response);
    document.getElementById('msg').innerHTML = "Status: Email criado...";
  },
    function (err) {
      console.error("Execute error", err);
      document.getElementById('msg').innerHTML = "Status: Erro...";

    });
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
