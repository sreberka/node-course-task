const sqlite3 = require("sqlite3").verbose();
const database = new sqlite3.Database('sqlite.db');

database.query = function (sql, params) {
  const that = this;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (error, result) {
      if (error)
        reject(error);
      else
        resolve(result);
    });
  });
};

const initDb = async () => {
  try {
    await database.run(
      `CREATE TABLE IF NOT EXISTS Users (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE)`);
    await database.run(
      `CREATE TABLE IF NOT EXISTS Exercises (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    description TEXT,
    duration INTEGER,
    date INTEGER,
    FOREIGN KEY(userId) REFERENCES Users(_id))`);
    console.log('Database created successfully!')
  }
  catch (e) {
    console.error(e);
  }
}


module.exports = {
  initDb,
  database
}
