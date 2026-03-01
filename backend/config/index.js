const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: process.env.USER_DB,
  password: process.env.PASS_DB,
  port: process.env.PORT,
});

const ConnectionDB = () => {
  pool
    .connect()
    .then(() => console.log("PostgreSQL server started"))
    .catch((err) => console.error("err:", err));
};
module.exports = { pool, ConnectionDB };
