const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    playerId: {
      type: String,
      required: true,
      unique: true,
    },
    rank: {
      type: Number,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["M", "F"],
    },
    ovr: {
      type: Number,
      required: true,
      min: 0,
      max: 99,
      index: true,
    },
    pace: {
      type: Number,
      index: true,
    },
    shooting: {
      type: Number,
    },
    passing: {
      type: Number,
    },
    dribbling: {
      type: Number,
    },
    defending: {
      type: Number,
    },
    physical: {
      type: Number,
    },
    acceleration: {
      type: Number,
    },
    sprintSpeed: {
      type: Number,
    },
    positioning: {
      type: Number,
    },
    finishing: {
      type: Number,
    },
    shotPower: {
      type: Number,
    },
    longShots: {
      type: Number,
    },
    volleys: {
      type: Number,
    },
    penalties: {
      type: Number,
    },
    vision: {
      type: Number,
    },
    crossing: {
      type: Number,
    },
    freeKickAccuracy: {
      type: Number,
    },
    shortPassing: {
      type: Number,
    },
    longPassing: {
      type: Number,
    },
    curve: {
      type: Number,
    },
    detailedDribbling: {
      type: Number,
    },
    agility: {
      type: Number,
    },
    balance: {
      type: Number,
    },
    reactions: {
      type: Number,
    },
    ballControl: {
      type: Number,
    },
    composure: {
      type: Number,
    },
    interceptions: {
      type: Number,
    },
    headingAccuracy: {
      type: Number,
    },
    defensiveAwareness: {
      type: Number,
    },
    standingTackle: {
      type: Number,
    },
    slidingTackle: {
      type: Number,
    },
    jumping: {
      type: Number,
    },
    stamina: {
      type: Number,
    },
    strength: {
      type: Number,
    },
    aggression: {
      type: Number,
    },
    position: {
      type: String,
      index: true,
    },
    weakFoot: {
      type: Number,
      min: 1,
      max: 5,
    },
    skillMoves: {
      type: Number,
      min: 1,
      max: 5,
    },
    preferredFoot: {
      type: String,
      enum: ["Left", "Right"],
    },
    height: {
      type: String,
    },
    weight: {
      type: String,
    },
    alternativePositions: {
      type: [String],
    },
    age: {
      type: Number,
      min: 15,
      max: 50,
    },
    nation: {
      type: String,
      index: true,
    },
    league: {
      type: String,
      index: true,
    },
    team: {
      type: String,
      index: true,
    },
    playStyles: {
      type: [String],
    },
    url: {
      type: String,
    },
    gkDiving: {
      type: Number,
    },
    gkHandling: {
      type: Number,
    },
    gkKicking: {
      type: Number,
    },
    gkPositioning: {
      type: Number,
    },
    gkReflexes: {
      type: Number,
    },
    card: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
