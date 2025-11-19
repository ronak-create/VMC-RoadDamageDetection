// const mongoose = require('mongoose');

// const DamageSchema = new mongoose.Schema({
//   id: Number,
//   type: String,
//   severity: String,
//   location: String,
//   coords: Array,
//   description: String,
//   reportedDate: String,
//   status: String
// });

// module.exports = mongoose.model('Damage', DamageSchema);

const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  id: Number,
  type: String,
  severity: String,
  location: String,
  coords: [Number],
  description: String,
  reportedDate: String,
  status: String
});

module.exports = mongoose.model('Report', ReportSchema);
