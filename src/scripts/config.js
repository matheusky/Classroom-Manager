var child_process = require('child_process');
var path = require('path');
var fs = require('fs');

const CREDENTIALS_PATH = path.resolve(__dirname,"../tokens/credentials.json");
const CREDENTIALS_PATH_ORIGIN = path.join(__dirname,"../../credentials.json");


window.addEventListener('load', function () {
  if (fs.existsSync(CREDENTIALS_PATH)) {
    document.getElementById('sts').innerHTML = "Pronto para o uso!";
    document.getElementById('btnconf').disabled = true;
    document.getElementById('incCred').disabled = true;
  }else{
    document.getElementById('sts').innerHTML = "Configuração necessária!";
  };
});

function myFunction() {
  const txt = "https://developers.google.com/classroom/quickstart/nodejs#step_1_turn_on_the";
  navigator.clipboard.writeText(txt);
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Link copiado!";
};
  
function outFunc() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copiar link para área de transferência";
};

async function conf() {
  const file = document.getElementById("incCred").files[0];
  
  fs.rename(file.path, CREDENTIALS_PATH_ORIGIN, (err) => {
    if (err) throw err;
  });
  
  window.alert(`Uma janela de terminal será aberta para iniciar a configuração!`);
  child_process.execSync(`start cmd.exe /K node ${path.join(__dirname,"../../configAPP.js")}`);
  location.reload();
};

function directory() {
  child_process.exec(`start "" ${path.join(__dirname,"../tokens/")}`);

};