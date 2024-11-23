const express = require('express');
const router = express.Router();
const db=require('../db');


router.post('/register_user', async (req, res) => {
    const {app_username, ext_password } = req.body;
    console.log(app_username);
    db.get(`INSERT INTO user VALUES(?,?,0);`,
        [app_username,ext_password],
      async (err, row) => {
        if (err){
            if (err.message.includes('UNIQUE constraint failed:')) {
                return res.json({msg:"Username Already Exist!"});
            }
            return res.json({error:"Error!"});
        }
        else{
            return res.json({msg:'Success!'});
        }
    });
});

module.exports = router;