const { database } = require('../db/db');
const { getFormattedDate, isValidDate, sendError } = require('../helpers');

const createExercise = async (req, res) => {
  const { description, duration, date } = req.body;

  if (!description){
    sendError(res, '"description" field is required!');
  } else if (!duration){
    sendError(res, '"duration" field is required!');
  } else if (date && !isValidDate(date)) {
    sendError(res, '"date" value should be valid and in "YYYY-MM-DD" format!');
  } else {
    try {
      const userId = req.params['_id'];
      const exerciseDate = new Date(date).getTime() || Date.now();
      const params =[userId, description, duration, exerciseDate];
      const sql ='INSERT INTO Exercises (userId, description, duration, date) VALUES (?,?,?,?)';
      await database.query(sql, params);
      const sqlForReturn = `SELECT username FROM Users WHERE _id = ?`;
      const result = await database.query(sqlForReturn, userId);
      const { username } = result[0];
      const response = {
        "_id": Number(userId),
        username,
        description,
        duration,
        date: getFormattedDate(exerciseDate)
      }
      res.json(response)
    } catch (e) {
      res.status(500).json({'error': e})
    }
  }
}

module.exports = {
  createExercise
}