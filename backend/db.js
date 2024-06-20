const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://my_kitchen:erenashah@mykitchen.kgkvaz0.mongodb.net/mykitchen?retryWrites=true&w=majority&appName=mykitchen';

const mongoDB = async () => {
  try {
    const connection = await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected.');

    const db = connection.connection.db;

    const fetched_data = await db.collection("fooddata").find({}).toArray();
    const food_category = await db.collection("food_category").find({}).toArray();

    global.food_items = fetched_data;
    global.food_category = food_category;
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

module.exports = mongoDB;
