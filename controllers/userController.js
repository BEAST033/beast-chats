const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });

    res.status(200).send({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

exports.upsertUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { phone: req.body.phone },
      req.body,
      { upsert: true, runValidators: true, new: true }
    );

    res.status(201).send({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};
