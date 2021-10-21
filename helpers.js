const getFormattedDate = date => {
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  return `${year}-${month < 10 ? 0 : ''}${month}-${day < 10 ? 0 : ''}${day}`;
}

const isValidDate = date => {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!date.match(regEx)) return false;
  const d = new Date(date);
  const dNum = d.getTime();
  if(!dNum && dNum !== 0) return false;
  return d.toISOString().slice(0,10) === date;
}

const sendError = (res, text) => {
  res.status(400).json({'error': text});
}

module.exports = {
  getFormattedDate,
  isValidDate,
  sendError
}