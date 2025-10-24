// generar-hash.js
import bcrypt from "bcrypt";

const password = "123456";

const run = async () => {
  const hash = await bcrypt.hash(password, 10);
  console.log("Hash bcrypt para 123456:", hash);
};

run();

