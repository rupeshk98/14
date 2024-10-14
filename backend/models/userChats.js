import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    chats: [
      {
        _id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        createdAT: {
          type: String,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserChats", userChatsSchema);
