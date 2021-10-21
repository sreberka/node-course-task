const { database } = require('../db/db');

const getAllUsers = async (req, res) => {
  try {
    const sql = 'SELECT * FROM Users';
    const result = await database.query(sql, []);
    res.json(result);
  } catch (e) {
    res.status(500).json({'error': e})
  }
}

const getUserByName = async (res, username) => {
  try {
    const sql = 'SELECT * FROM Users WHERE username = ?'
    const result = await database.query(sql, username);
    res.json(result);
  } catch (e) {
    res.status(500).json({'error': e})
  }
}

const createUser = async (req, res) => {
  if (!req.body.username){
    res.status(400).json({'error': '"username" field is required!'});
  } else {
    try {
      const { username } = req.body;
      const sql = 'INSERT INTO Users (username) VALUES (?)'
      await database.query(sql, username);
      await getUserByName(res, username);
    } catch (e) {
      res.status(500).json({'error': e})
    }
  }
};

module.exports = {
  getAllUsers,
  createUser
}