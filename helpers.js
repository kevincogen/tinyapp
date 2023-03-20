const generateRandomString = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  while (randomString.length < 6) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString
};

const getUserByEmail = email => {
  for (const userID in users) {
    const user = users[userID]
    if (user.email === email) {
      return user
    }
  }
  return null;
};

const urlsForUser = (userid, database) => {
  const userURL = {};
  for (const id in database) {
    console.log(id)
    console.log(userid)
    if (database[id].userID === userid) {
      userURL[id] = database[id];
      console.log("matches!")
      console.log(database[id])
      console.log(userURL[id])
    }
  }
  return userURL;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser }