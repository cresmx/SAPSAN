// get-tokens.js
import axios from "axios";
import fs from "fs";

const API_URL = "http://localhost:5000/api/auth/login";
const PASSWORD = "123456";

const users = [
  { username: "admin_test", role: "ADMIN" },
  { username: "cajero_test", role: "CAJERO" },
  { username: "supervisor_test", role: "SUPERVISOR" },
  { username: "capturista_test", role: "CAPTURISTA" },
];

async function loginAndGetToken(username, password) {
  try {
    const res = await axios.post(API_URL, { username, password });
    return res.data.token;
  } catch (err) {
    console.error(`❌ Error al loguear ${username}:`, err.response?.data || err.message);
    return null;
  }
}

async function main() {
  let envContent = "";

  for (const user of users) {
    const token = await loginAndGetToken(user.username, PASSWORD);
    if (token) {
      console.log(`✅ Token obtenido para ${user.username}`);
      envContent += `${user.role}_TOKEN=${token}\n`;
    }
  }

  fs.writeFileSync(".env", envContent);
  console.log("🎉 Tokens guardados en .env");
}

main();
