import UserChats from "../models/userChats.js";
import Chat from "../models/chat.js";
export const createuserChats = async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;
  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

      res.status(201).send(newChat._id);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
};

// get user chats

export const getuserChats = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userChats = await UserChats.find({ userId });
    res.status(200).send(userChats[0].chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching userchats!");
  }
};

// get chat by id

export const getChats = async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
};

// update chat

export const updateChats = async (req, res) => {
  const userId = req.auth.userId;

  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updateChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updateChat);
  } catch (err) {
    res.status(500).send("Error adding conversation!");
  }
};

// delete chat by id
export const deleteChat = async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.id;

  try {
    // Delete the chat document
    await Chat.findOneAndDelete({ _id: chatId, userId });

    // Remove the chat reference from UserChats
    await UserChats.updateOne(
      { userId },
      {
        $pull: {
          chats: { _id: chatId },
        },
      }
    );

    res.status(200).send({ message: "Chat deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting chat!");
  }
};
