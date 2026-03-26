const mysql = require('mysql2/promise');
const passwords = ['root', 'password', '12345', '1234', '123', 'admin', 'mysql', 'digital_admission', 'EduPortal'];

async function test() {
  for (let pass of passwords) {
    try {
      const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: pass });
      console.log('SUCCESS_PASSWORD:' + pass);
      await conn.end();
      return;
    } catch (err) {
      if (err.code !== 'ER_ACCESS_DENIED_ERROR') {
        console.log('OTHER_ERROR:' + err.message);
        return;
      }
    }
  }
  console.log('NO_PASSWORD_FOUND');
}

test();
