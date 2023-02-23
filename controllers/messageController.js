const mongoose = require("mongoose");
const Message = require("../models/Message");

exports.createMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    const newMessage = await Message.create({
      message,
      users: [sender, receiver],
      sender,
    });

    res.status(201).send({
      status: "success",
      data: {
        message: newMessage,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    const messages = await Message.updateMany(
      {
        users: {
          $all: [
            mongoose.Types.ObjectId(sender),
            mongoose.Types.ObjectId(receiver),
          ],
        },
        sender: mongoose.Types.ObjectId(sender),
        isRead: false,
      },
      req.body
    );

    res.status(200).json({
      status: "success",
      data: {
        messages,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getMessagesInfo = async (req, res) => {
  try {
    const sender = req.params.id;
    const { receiver } = req.query;

    const count = await Message.aggregate([
      {
        $match: {
          users: {
            $all: [
              mongoose.Types.ObjectId(sender),
              mongoose.Types.ObjectId(receiver),
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $ne: ["$isRead", false] },
                    { $eq: ["$sender", mongoose.Types.ObjectId(sender)] },
                  ],
                },
                0,
                1,
              ],
            },
          },
        },
      },
      { $project: { _id: 0, unreadCount: 1 } },
    ]);

    const messages = await Message.aggregate([
      {
        $match: {
          users: {
            $all: [
              mongoose.Types.ObjectId(sender),
              mongoose.Types.ObjectId(receiver),
            ],
          },
        },
      },

      { $sort: { createdAt: -1 } },

      { $limit: 1 },

      {
        $project: {
          _id: 0,
          message: 1,
          sender: 1,
          isRead: 1,
          createdAt: 1,
        },
      },
    ]);

    if (count.length === 0 && messages.length === 0) {
      return res.status(200).send({
        status: "success",
        data: {
          unread: null,
          lastMessage: null,
        },
      });
    }

    res.status(200).send({
      status: "success",
      data: {
        unread: count[0].unreadCount,
        lastMessage: messages[0],
      },
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    const messages = await Message.aggregate([
      {
        $match: {
          users: {
            $all: [
              mongoose.Types.ObjectId(sender),
              mongoose.Types.ObjectId(receiver),
            ],
          },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $project: {
          _id: 0,
          message: 1,
          createdAt: 1,
          isRead: 1,
          fromSelf: { $eq: ["$sender", mongoose.Types.ObjectId(sender)] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              // This will give wrong time globally
              timezone: "Asia/Karachi",
              date: "$createdAt",
            },
          },
          messages: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $group: {
          _id: null,
          messages: {
            $push: {
              $cond: [
                { $ne: ["$_id", { $arrayElemAt: ["$groupKey", -2] }] },
                [{ date: "$_id", messages: "$messages" }],
                "$messages",
              ],
            },
          },
        },
      },
      {
        $project: {
          messages: {
            $reduce: {
              input: "$messages",
              initialValue: [],
              in: {
                $concatArrays: ["$$value", "$$this"],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          messages: 1,
        },
      },
    ]);

    res.status(200).send({
      status: "success",
      data: {
        messages: messages.length === 0 ? messages : messages[0].messages,
      },
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: err.message,
    });
  }
};
