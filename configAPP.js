var fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const path = require('path');


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses','https://www.googleapis.com/auth/classroom.rosters'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const TOKEN_PATH = path.join(__dirname, "src/tokens/tokens.json");
const CREDENTIALS_PATH = path.join(__dirname, "src/tokens/credentials.json");
const CREDENTIALS_PATH_ORIGIN = path.join(__dirname,"credentials.json");

// Load client secrets from a local file.
fs.readFile(CREDENTIALS_PATH_ORIGIN, (err, content) => {
  if (err) return console.log('Credencial não encontrada!','\n\n','Anexe a credencial e recomece a configuração.');
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), msgExit);
});


function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}



function getNewToken(oAuth2Client, callback) {

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('LINK DE AUTENTICAÇÃO:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });


  rl.question('Digite o código de acesso fornecido:', (code) => {

    rl.close();

    oAuth2Client.getToken(code, (err, token) => {

      if (err) return console.error('Erro! Código é invalido ou está incorreto, feche essa janela e recomece o processo.');

      oAuth2Client.setCredentials(token);

      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Seu Token foi gerado e salvo em:', TOKEN_PATH ,'\n');
      });
    
    fs.rename(CREDENTIALS_PATH_ORIGIN, CREDENTIALS_PATH, (err) => {
        if (err) throw err;
        console.log('Sua credencial foi movida para:', CREDENTIALS_PATH ,'\n');
      });

      
      callback(oAuth2Client);
    });
});
}

//---------

function msgExit() {
    console.log('\n',' Configuração efetuada com sucesso!','\n');
    console.log('\n',' Feche esta janela para continuar.','\n\n');
}