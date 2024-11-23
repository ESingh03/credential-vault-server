const express = require('express');
const router = express.Router();
const db=require('../db');


router.post('/login_user', async (req, res) => {
    const {app_username, ext_password } = req.body;
    console.log(app_username);
    db.get(`SELECT user,
    password as pass
    FROM user WHERE user = ? AND pass = ?;`,
        [app_username,ext_password],
      async (err, row) => {
        if (err){
            return res.json({error:"Error!"});
        }
        if(row){
          return res.json({msg:"Success"});
        }
        else{
            return res.json({msg:"Incorrect Username or Password!"});
        }
    });
});

module.exports = router;