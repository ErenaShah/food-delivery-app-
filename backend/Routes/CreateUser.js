const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jwt
const jwtSecret = "cbgeskbftgrweunsjhxnfgrtbjcfgsncreyubgcf";

router.post(
  "/createuser",
  [
    body('email', 'Invalid email address').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
    body('name', 'Name is required').notEmpty(),
    body('location', 'Location is required').notEmpty() 
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const invalidCredentials = [];

      errors.array().forEach(error => {
        invalidCredentials.push(`${error.param}: ${error.msg}`);
      });

      console.log("Invalid Credentials:");
      console.log(invalidCredentials);

      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const salt = await bcrypt.genSalt(10);
      let secPassword = await bcrypt.hash(req.body.password, salt);

      await User.create({
        name: req.body.name,
        password: secPassword, // Save the hashed password
        email: req.body.email,
        location: req.body.location,
      });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

router.post(
  "/loginuser",
  async (req, res) => {
    try {
      let useremail = await User.findOne({ email: req.body.email }); // Find by email object
      if (!useremail) {
        return res.status(400).json({ success: false, error: "TRY LOGGING IN WITH CORRECT CREDENTIALS" });
      }

      const pwdcompare = await bcrypt.compare(req.body.password, useremail.password); // Compare with useremail.password
      if (!pwdcompare) {
        return res.status(400).json({ success: false, error: "TRY LOGGING IN WITH CORRECT CREDENTIALS" });
      }

      const data = {
        user: {
          id: useremail.id
        }
      }

      const authToken = jwt.sign(data, jwtSecret);
      return res.json({ success: true, authToken: authToken });
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

module.exports = router;
