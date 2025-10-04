const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  votes: [
    //votes will store array of objects, which will have two keys 'user' and 'votedAt'
    //user: contains user id which will come from 'User' database/Table,
    //votedAt: contains the time at which user voted i.e at which time the enter is made in votes
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,// will get user id and it will come from 'User' table 
        ref: "User", //Means get data from 'User' table
        required: true,
      },
      votedAt: {
        type: Date, //Date is provided by the mongoose
        default: Date.now(), //Current date the moment entery is created
      },
    },
  ],
  voteCount: {
    type: Number, //it can simply by length of votes
    default: 0, 
  },
});

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
