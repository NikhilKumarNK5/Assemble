const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const users = require("../controllers/users");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  fullname: {
    type: String,
    unique: true,
    default: "",
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    default: "",
  },
  userImage: {
    type: String,
    default: "default.png",
  },
  facebook: {
    type: String,
    default: "",
  },
  fbTokens: Array,
  google: {
    type: String,
    default: "",
  },
  sentRequest: [
    {
      username: {
        type: String,
        default: "",
      },
    },
  ],
  request: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
        default: "",
      },
    },
  ],
  friendsList: [
    {
      friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      friendName: {
        type: String,
        default: "",
      },
    },
  ],
  totalRequest: {
    type: Number,
    default: 0,
  },
  gender: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: ""
  },
  mantra: {
    type: String,
    default: ""
  },
  favNationalTeam: [{
    teamName: {
      type: String,
      default: ""
    }
  }],
  favPlayer: [{
    playerName: {
      type: String,
      default: ""
    }
  }],
  favClub: [{
    clubName: {
      type: String
    }
  }]
});

userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}; // to encrypt the password to save in database

userSchema.methods.validUserPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}; // to decrypt and compare the password while logging in

module.exports = mongoose.model("User", userSchema);
