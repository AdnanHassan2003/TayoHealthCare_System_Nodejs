const { JWT } = require('google-auth-library');
const serviceAccount = require('../serviceAccountKey.json');

const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];

async function getAccessToken() {
  const jwtClient = new JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    SCOPES,
    null
  );

  await jwtClient.authorize();
  return jwtClient.credentials.access_token;
}

module.exports = { getAccessToken };
