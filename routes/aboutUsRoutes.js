const express = require('express');
const router = express.Router();
const users = require('../data/aboutUsData.json'); 

// GET /aboutus/:name
router.get('/aboutus/:name', (req, res) => {
  const { name } = req.params;
  const foundUser = users.find(u => u.name === name);

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