const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
},
//  () => {
//   mongoose.connection.db.dropDatabase();
// }
);

module.exports = mongoose.connection;
