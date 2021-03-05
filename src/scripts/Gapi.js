//Auth
const TOKEN_PATH = path.join(__dirname, "../tokens/tokens.json");
const CREDENTIALS_PATH = path.join(__dirname, "../tokens/credentials.json");
const credentialsFile = fs.readFileSync(CREDENTIALS_PATH, "utf-8");
const tokenFile = fs.readFileSync(TOKEN_PATH, "utf-8");
const credentials = JSON.parse(credentialsFile);
const token = JSON.parse(tokenFile);
const { client_secret, client_id, redirect_uris } = credentials.installed;
var oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(token);
const auth = oAuth2Client;
const classroom = google.classroom({ version: 'v1', auth });//Classroom
const googleSDK = google.admin({ version: 'directory_v1', auth });//Google ADM