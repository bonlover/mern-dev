const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route GET api/users
// @desc Register user
// @access Public
router.post(
  '/',
  [
    check('name', 'Name is required.').notEmpty(),
    check('email', 'Please include a valid email.').isEmail(),
    check(
      'password',
      'Please enter password and should be atleast 8 characters.'
    ).isLength({
      min: 4,
    }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'User already exists.' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret', { expiresIn: 360000 }),
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      //   res.send('User registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

    // console.log(req.body);
    // res.send('Users route.');
  }
);

module.exports = router;
