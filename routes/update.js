const express = require('express');
const router = express.Router();
const db=require('../db');

router.post('/update', async (req, res) => {
    const {app_username, password } = req.body;
    db.get(`Update user
        SET password=? WHERE user = ?;`,
        [password,app_username],
      async (err, row) => {
        if (err) {
          console.error(err.message);
          return res.json({error:"Error"});
        }
        else{
            return res.json({msg:'Successfully Updated!'});
        }
    });
});

module.exports = router;