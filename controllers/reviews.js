const Kidground = require('../models/kidground');
const Review = require('../models/review');

module.exports.createReview = async(req, res)=>{
    const kidground = await Kidground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    kidground.reviews.push(review);
    await review.save();
    await kidground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/kidgrounds/${kidground._id}`);
}

module.exports.deleteReview = async(req, res) =>{
    const{ id, reviewId } = req.params;
    await Kidground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deteleted review.')
    res.redirect(`/kidgrounds/${id}`);
}