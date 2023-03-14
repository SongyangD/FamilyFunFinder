const Kidground = require('../models/kidground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const kidgrounds = await Kidground.find({});
    res.render('kidgrounds/index', { kidgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('kidgrounds/new');
}

module.exports.createKidground = async (req, res, next) => {
    const kidground = new Kidground(req.body.kidground);
    kidground.images = req.files.map(f =>({ url: f.path, filename: f.filename }));
    kidground.author = req.user._id;
    await kidground.save();
    req.flash('success', 'Successfully post a new kidspace!')
    res.redirect(`kidgrounds/${kidground._id}`)
}

module.exports.showKidground = async (req, res) => {
    const kidground = await Kidground.findById(req.params.id).populate({ 
        path: 'reviews', 
        populate: {
             path: 'author' 
            } 
    }).populate('author');
    console.log(kidground);
    if (!kidground ){
        req.flash('error', 'Can not find that kidspace!');
        return res.redirect('/kidgrounds');
    }
    res.render('kidgrounds/show', { kidground });
}

module.exports.renderEditFrom = async (req, res) => {
    const { id } = req.params;
    const kidground = await Kidground.findById(id)
    if (!kidground ){
        req.flash('error', 'Can not find that kidspace!');
        return res.redirect('/kidgrounds');
    }
    res.render('kidgrounds/edit', { kidground });
}

module.exports.updateKidground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const kidground = await Kidground.findByIdAndUpdate(id, { ...req.body.kidground });
    const imgs = req.files.map(f =>({ url: f.path, filename: f.filename}));
    kidground.images.push(...imgs);
    await kidground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await kidground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated kidspace!');
    res.redirect(`/kidgrounds/${kidground._id}`)
}

module.exports.deleteKidground = async (req, res) => {
    const { id } = req.params;
    const kidground = await Kidground.findByIdAndDelete(id);
    for (let image of kidground.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
    
    req.flash('success', 'Successfully deteleted kidspace.')
    res.redirect('/kidgrounds');
}

