import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  youtube_url: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  },
  imageUrl: {
    type: String,
    default: ""
  },
  likes: {
    type: Number,
    min: 0,
    default: 0
  },
},{
  timestamps: true
});

// Automatically update updated_at on save
SessionSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Session = mongoose.model("Session", SessionSchema);

export default Session;