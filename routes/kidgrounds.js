const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Kidground = require('../models/kidground');
const { isLoggedIn, isAuthor, validateKidground } = require('../middleware');
const kidgrounds = require('../controllers/kidgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(kidgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateKidground, catchAsync(kidgrounds.createKidground));
    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.files);
    //     res.send ("IT WORKS");
    // })

router.get('/new', isLoggedIn, kidgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(kidgrounds.showKidground))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateKidground, catchAsync(kidgrounds.updateKidground))
    .put(isLoggedIn, isAuthor, validateKidground, catchAsync(kidgrounds.updateKidground))
    .delete(isLoggedIn, isAuthor, catchAsync(kidgrounds.deleteKidground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(kidgrounds.renderEditFrom));


module.exports = router;