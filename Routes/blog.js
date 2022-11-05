const express = require('express');
const { getBlogs } = require('../Controller/blogController');

const router = express.Router();

router.get("/", getBlogs);

module.exports = router;