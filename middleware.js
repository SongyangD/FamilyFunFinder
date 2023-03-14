const { kidgroundSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Kidground = require('./models/kidground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateKidground = (req, res, next) => {
    const { error } = kidgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next)=>{
    const { id } = req.params;
    console.log(id);
    const kidground = await Kidground.findById(id);
    if (!kidground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/kidgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    const { id, reviewId } = req.params;
    console.log(id);
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/kidgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}