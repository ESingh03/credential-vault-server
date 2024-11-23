const express = require('express');
const router = express.Router();
const db = require('../db');



router.post('/recieve_request', async (req, res) => {
  // Function to check map value with timeout logic
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
    }, 500); // Interval between checks
  });
}
  const { type, username, password, domain } = req.body;
  var requests = req.app.locals.requests;
  let timeoutId; // Declare the timeout variable to clear it later
  let isResponded = false; // Flag to check if response is already sent

  console.log(username);
  console.log(password);
  console.log(domain);

  db.get(`SELECT user, password as pass FROM user WHERE user = ? AND pass = ?;`,
    [username, password],
    async (err, row) => {
      if (err) {
        console.error(err.message);
        return; // Don't proceed further if there's an error in the database query
      }

      if (row) {
        // Add request to the temporary store
        requests.set(username, { domain: domain, type: type });

        timeoutId = setTimeout(() => {
          if (!isResponded) {
            requests.delete(username); // Clean up the request after timeout
            console.log(`Data with key ${username} removed from temporary store.`);
            res.json({ msg: 'Timeout' }); // Send timeout response
            isResponded = true; // Mark that a response has been sent
          }
        }, 30000); // Timeout after 30 seconds

        try {
          console.log(`Data with username ${username} waiting for value...`);

          const value = await checkMapValue(username, 50000); // Check map value with 50-second timeout
          clearTimeout(timeoutId); // Clear timeout if the task completes successfully

          if (!isResponded) {
            res.json(value); // Send the response if not already sent
            isResponded = true; // Mark that a response has been sent
          }
        } catch (error) {
          console.log(`Data with key ${username} failed`);

          if (!isResponded) {
            res.status(500).json({ error: error.message }); // Send error response
            isResponded = true; // Mark that a response has been sent
          }
        }
      } else {
        res.json({ error: "Invalid" }); // Handle invalid credentials
        isResponded = true; // Mark that a response has been sent
      }
    });
});

module.exports = router;
