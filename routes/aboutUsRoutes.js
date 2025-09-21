const express = require('express');
const router = express.Router();
const users = require('../data/aboutUsData.json'); 

// GET /aboutus/:user
router.get('/aboutus/:user', (req, res) => {
  const { user } = req.params;
  const foundUser = users.find(u => u.user === user);

  if (foundUser) {
    res.json({
      name: foundUser.name,
      nim: foundUser.nim
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;