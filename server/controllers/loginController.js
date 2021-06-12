const db = require("../models/dbModel.js");
const bcrypt = require("bcryptjs");

const loginController = {};

loginController.verifyUser = async (req, res, next) => {
  const { username, password } = req.body;

  const searchQuery = "SELECT password, cookie FROM users where username = $1";
  const searchParams = [username];
  let hashedPass;
  try {
    const { rows } = await db.query(searchQuery, searchParams);
    console.log("return array of obj", rows);
    // [{password: fdashjfksda, cookie: jdfaslk}]
    if (rows.length) hashedPass = rows[0].password;
    else return next({ err: "cannot find password for some reason " + e });
    const passwordMatched = bcrypt.compare(password, hashedPass);
    if (passwordMatched) {
      res.locals.username = username;
      res.cookie("SSID", rows[0].cookie);
    } else {
      return next({ err: "invalid password" });
    }
    return next();
  } catch (e) {
    return next({ err: "error with searching for user pass in db: " + e });
  }
};

module.exports = loginController;
