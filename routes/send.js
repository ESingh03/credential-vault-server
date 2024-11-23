const express = require('express');
const router = express.Router();

router.post('/send', async (req, res) => {
    const fullfilled = req.app.locals.fullfilled;
    const {app_username, msg, username, password} = req.body;
    fullfilled.set(app_username, { msg:msg, username:username,password:password });
    setTimeout(() => {
        if(fullfilled.get(app_username)===undefined){
            return res.json({msg:"Sucess"});
        }
        fullfilled.delete(username);
        return res.json({msg:'Timeout'});
    }, 1500);
});

module.exports = router;