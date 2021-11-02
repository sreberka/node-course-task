const { database } = require('../db/db');
const { getFormattedDate, isValidDate, sendError } = require('../helpers');

const getLogs = async (req, res) => {
  const { from, to, limit } = req.query;
  const userId = req.params['_id'];
  if(from && !isValidDate(from)) {
    sendError(res, '"from" value should be valid and in "YYYY-MM-DD" format.');
  } else if (to && !isValidDate(to)) {
    sendError(res, '"to" value should be valid and in "YYYY-MM-DD" format.');
  } else if (limit && isNaN(parseInt(limit, 10))) {
    sendError(res, '"limit" value should be a number.');
  } else {
    try {
      const sqlGetUser = 'SELECT * FROM Users WHERE _id = ?';
      const user = await database.query(sqlGetUser, userId);
      if(user.length === 0) {
        res.status(404).json({'error': 'user not found'})
      } else {
        const startDate = from ? `AND Exercises.date > ${new Date(from).getTime()}` : '';
        const endDate = to ? `AND Exercises.date < ${new Date(to).getTime()}` : '';
        const resultLimit = limit ? `LIMIT ${limit}` : '';
        const sqlGetAll = 'SELECT COUNT(*) FROM Exercises WHERE userId = ?';
        const sqlExercisesWithQuery = `SELECT Exercises.description, Exercises.duration, Exercises.date FROM Users INNER JOIN Exercises ON Users._id=Exercises.userId WHERE Users._id=? ${startDate} ${endDate} ${resultLimit}`;
        const exercisesWithQuery = await database.query(sqlExercisesWithQuery, userId);
        const all = await database.query(sqlGetAll, userId);
        const exercises = exercisesWithQuery.map(item => ({
          description: item.description,
          duration: item.duration,
          date: getFormattedDate(item.date)
        }));
        res.json({
          ...user[0],
          total: all[0]['COUNT(*)'],
          exercises
        });
      }
    } catch (e) {
      res.status(500).json({'error': e})
    }
  }
}

module.exports = {
  getLogs
}