const express = require('express');
const router = express.Router();
const db=require('../db');
  



router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
  
    db.get(`SELECT user,
        password as pass
        FROM user WHERE user = ? AND pass = ?;`,
        [username, password],
      async (err, row) => {
        if (err) {
          console.error(err.message);
        }
        if (row) {
          db.get(`SELECT user,
            password as pass
            FROM user WHERE user = ? AND pass = ? AND subscribed = 1;`,
                [username,password],
              async (err, row) => {
                if (err){
                    return res.json({error:"Error!"});
                }
                if(row){
                    console.log(row)
                    return res.json({msg:'Success!'});
                }
                else{
                    return res.json({msg:"Please buy Credentail vault Pro to avail this service!"});
                }
            });
        }
        else{
          return res.json({error:"Invaild"});
        }
    });
});

  module.exports = router;
