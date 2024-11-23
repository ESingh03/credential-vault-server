const express = require('express');
const router = express.Router();
const db=require('../db');


router.post('/fetchreq', async (req, res) => {
    const requests = req.app.locals.requests;
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
                const value = requests.get(app_username);
                if (value !== undefined) {
                    console.log(value);
                    requests.delete(app_username);
                    return res.json({ msg: 'Available', data: value });
                }
                else {
                    return res.json({ msg: 'No Requests' });
                }
            }
            else {
                return res.json({ msg: "Please buy Credentail vault Pro to avail this service!" });
            }
        });

});

module.exports = router;
