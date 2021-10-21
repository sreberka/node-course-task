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
      const startDate = from ? `AND date > ${new Date(from).getTime()}` : '';
      const endDate = to ? `AND date < ${new Date(to).getTime()}` : '';
      const resultLimit = limit ? `LIMIT ${limit}` : '';
      const sqlGetAll = 'SELECT * FROM Exercises WHERE userId = ?';
      const sqlGetUser = 'SELECT * FROM Users WHERE _id = ?';
      const sqlWithQuery = `SELECT * FROM Exercises WHERE userId = ? ${startDate} ${endDate} ${resultLimit}`;
      const all = await database.query(sqlGetAll, userId);
      const user = await database.query(sqlGetUser, userId);
      const result = await database.query(sqlWithQuery, userId);
      const exercises = result.map(item => ({
        description: item.description,
        duration: item.duration,
        date: getFormattedDate(item.date)
      }))
      res.json({
        ...user[0],
        total: all.length,
        exercises
      })
    } catch (e) {
      res.status(500).json({'error': e})
    }
  }
}

module.exports = {
  getLogs
}