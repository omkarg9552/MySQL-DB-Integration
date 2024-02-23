const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "pass",
  database: "Mydb_name",
  port: "3360"
});

connection.connect((err) => {
  if (err) {
    console.log("Database connection Failed :", err);
  }
  else{
    console.log("Database connected sucessfully...!");
  }
});

const pool = mysql.createPool(connection);

function endTemp() {
    connection.end((err) => {
    if (err) throw err;
    console.log("Connection to MySQL database closed!");
  });
}

const executeQuery = async ({ query, values }) => {
  return new Promise((resolve, reject) => {
    connection.query(query, values, function (err, results, fields) {
      if (err) {
        reject('Error while inserting data!');
      } else {
        // resolve('Data inserted successfully!');
        resolve(results);
      }
    });
  });
};

module.exports = { connection,pool, endTemp, executeQuery };