const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Kidground = require('../models/kidground');


mongoose.connect('mongodb://localhost:27017/yelp-kidground', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connction error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Kidground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*10)+10;
        const ground = new Kidground({
            author: '63d4339b6e44ee7884820828',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/9479488',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti doloribus velit soluta minus nam quia quasi. Quisquam aliquid eveniet labore totam alias adipisci, cum, doloribus et dolorum hic, inventore a!',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dg27szqgb/image/upload/v1675525717/FFF/rbtl279pkugqulatsvs4.jpg',
                  filename: 'FFF/rbtl279pkugqulatsvs4'
                },
                {
                  url: 'https://res.cloudinary.com/dg27szqgb/image/upload/v1675525717/FFF/appsr6xl4wo5iopajlsy.jpg',
                  filename: 'FFF/appsr6xl4wo5iopajlsy'
                }
              ]
        })
        await ground.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})