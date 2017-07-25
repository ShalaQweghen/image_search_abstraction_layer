var mongoose = require("mongoose");

var searchSchema = new mongoose.Schema({
    term: String,
    when: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Search", searchSchema);