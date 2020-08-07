const CryptoJS = require("crypto-js");
const { validationResult } = require("express-validator");

const db = require("../database");
const { generateQuery, asyncQuery } = require("../helpers/queryHelp");
const util = require("util");

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  register: async (req, res) => {
    console.log("body : ", req.body);
    // console.log(`TOKEN GMAIL :`, TOKEN_GMAIL)
    const { username, password, confpassword, email } = req.body;
    
    try {
      // validate user input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array()[0].msg });
      }

      // check password
      if (password !== confpassword) {
        return res.status(400).send("password doesn't match.");
      }

      // insert new user to database
      const checkUser = `SELECT * FROM users WHERE username='${username}' OR email='${email}'`;
      const hasil = await asyncQuery(checkUser);

      // check result
      if (hasil.length > 0) {
        return res.status(400).send("Username or Email is already used.");
      }

      // encypt password before insert into database
      const hashpass = CryptoJS.HmacMD5(password, SECRET_KEY);
      const insertUser = `INSERT INTO users (username, email, password, role, status)
                              values ('${username}', '${email}', '${hashpass.toString()}', 'user', 1)`;
      const resultQuery = await asyncQuery(insertUser);

      const new_userId = resultQuery.insertId;

      // insert new profile to database
      const insertProfile = `INSERT INTO profil (user_id) values (${new_userId})`;
      const newProfile = await asyncQuery(insertProfile);
      res.status(200).send(newProfile);
    } catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
  },
  login: async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const getDataUsername = `SELECT * FROM users WHERE username = '${username}' or email = '${email}'`;
      const resultUname = await asyncQuery(getDataUsername);

      if (resultUname.length === 0) {
        return res.status(400).send(`Username or email not found`);
      }

      //check password : password form user vs password form database
      const hashpass = CryptoJS.HmacMD5(password, SECRET_KEY);
      if (hashpass.toString() !== resultUname[0].password) {
        return res.status(400).send("invalid password.");
      }

      delete resultUname[0].password;

      res.status(200).send(resultUname[0]);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  },
  deactiveAcc: async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(req.params.id)
    // console.log("body : ", req.body);
      try {
          // check if user with id exist in our database
      const queryCU = `SELECT * FROM users WHERE id=${id}`;
      const check = await asyncQuery(queryCU);
      if (check.length === 0)
        return res.status(400).send(`user with id : ${id} doens't exists.`);
               
      // edit to deactivate acc
      const editDeact = `UPDATE users SET ${generateQuery(
        req.body
      )} WHERE id=${id}`;
      const resultDeact = await asyncQuery(editDeact);

      res.status(200).send(resultDeact)

      } catch (err) {
          console.log(err)
          return res.status(500).send(err);
      }
  },
  activeAcc: async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(req.params.id)
    // console.log("body : ", req.body);
      try {
          // check if user with id exist in our database
      const queryActiveACC = `SELECT * FROM users WHERE id=${id} and status = 1`;
      const check = await asyncQuery(queryActiveACC);
      if (check.length === 0)
        return res.status(400).send(`user with id : ${id} doens't exists.`);
               
      // edit to deactivate acc
    //   const editDeact = `UPDATE users SET ${generateQuery(
    //     req.body
    //   )} WHERE id=${id}`;
    //   const resultDeact = await asyncQuery(editDeact);

      res.status(200).send(check)

      } catch (err) {
          console.log(err)
          return res.status(500).send(err);
      }
  },
  closeAcc: async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(req.params.id)
    // console.log("body : ", req.body);
      try {
          // check if user with id exist in our database
      const queryCloseACC = `SELECT * FROM users WHERE id=${id} status= 3`;
      const check = await asyncQuery(queryCloseACC);
      if (check.length === 0)
        return res.status(400).send(`user with id : ${id} doens't exists.`);
               
      // edit to deactivate acc
    //   const editDeact = `UPDATE users SET ${generateQuery(
    //     req.body
    //   )} WHERE id=${id}`;
    //   const resultDeact = await asyncQuery(editDeact);

      res.status(200).send(check)

      } catch (err) {
          console.log(err)
          return res.status(500).send(err);
      }
  }
};
