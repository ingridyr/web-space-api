const mongoose = require("../database");

mongoose.connect(process.env.MONGO_URL, { useMongoClient: true });

mongoose.Promise = global.Promise;

module.exports = mongoose;
