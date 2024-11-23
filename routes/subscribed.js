const express = require('express');
const router = express.Router();
const db=require('../db');


router.post('/subscribed', async (req, res) => {
    const { app_username } = req.body;
    console.log(app_username);
    db.get(`SELECT user
        FROM user WHERE user = ? AND subscribed = 1;`,
        [app_username],
        async (err, row) => {
            if (err) {
                return res.json({ error: "Error!" });
            }
            if (row) {
                return res.json({ subscribed: true});
            }
            else {
                return res.json({ subscribed: false});
            }
        });

});

module.exports = router;
