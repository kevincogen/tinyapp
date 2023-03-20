const generateRandomString = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  while (randomString.length < 6) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString;
};

const getUserByEmail = (email, users) => {
  for (const userID in users) {
    const user = users[userID];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

const urlsForUser = (userid, database) => {
  const userURL = {};
  for (const id in database) {
    if (database[id].userID === userid) {
      userURL[id] = database[id];
    }
  }
  return userURL;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser };