const express = require('express');
const router = express.Router();
const db=require('../db');




router.post('/recieve_request', async (req, res) => {
    function checkMapValue(key, timeout) {
        return new Promise((resolve, reject) => {
          const start = Date.now();
      
          const checkInterval = setInterval(() => {
            const sharedMap = req.app.locals.fullfilled;
            const value = sharedMap.get(key);
      
            if (value !== undefined) {
              clearInterval(checkInterval);
              sharedMap.delete(key);
              resolve(value);
            }
            if (Date.now() - start >= timeout) {
              clearInterval(checkInterval);
              reject(new Error(`Value not found in map within ${timeout} milliseconds`));
            }
          }, 500);//time after it checks value
        });
      }
    const {type, username, password, domain } = req.body;
    var requests= req.app.locals.requests;
    console.log(username);
    console.log(password);
    console.log(domain);
  
    db.get(`SELECT user,
        password as pass
        FROM user WHERE user = ? AND pass = ?;`,
        [username, password],
      async (err, row) => {
        if (err) {
          console.error(err.message);
        }
        if (row) {
            requests.set(username, { domain: domain, type:type });
            timeoutId=setTimeout(() => {
                requests.delete(username);
                
                console.log(`Data with key ${username} removed from temporary store.`);
                return res.json({msg:'Timeout'});
            }, 30000);
            try {
                const value = await checkMapValue(username, 50000);
                clearTimeout(timeoutId);
                return res.json(value);
              } catch (error) {
                return res.status(500).json(error.message);
              }
        }
        else{
          return res.json({error:"Invaild"});
        }
    });
});

  module.exports = router;
