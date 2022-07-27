const { User, Thought } = require('../models');

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find()
      .select('-__v')
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate([
        { path: 'thoughts', select: '-__v' },
        { path: 'friends', select: '-__v' },
      ])
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // update an existing user
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user with that ID' });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },
  // Delete a user and associated thoughts
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : User.updateMany(
              { _id: { $in: user.friends } },
              { $pull: { friends: params.id } }
            )
      )
      .then(() => {
        Thought.deleteMany({ username: user.username });
      })
      .then(() =>
        res.json({ message: 'User and associated thoughts deleted!' })
      )
      .catch((err) => res.status(400).json(err));
  },

  // Add a friend and add to user's friend list
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user with that ID' });
          return;
        }
        User.findOneAndUpdate(
          { _id: params.friendId },
          { $addToSet: { friends: params.userId } },
          { new: true, runValidators: true }
        )
          .then((userFriend) => {
            if (!userFriend) {
              res.status(404).json({ message: 'No user with that friend ID' });
              return;
            }
            res.json(user);
          })
          .catch((err) => json(err));
      })
      .catch((err) => json(err));
  },
  // Delete a friend and remove from any associated users' friend lists
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user with that ID' });
          return;
        }
        User.findOneAndUpdate(
          { _id: params.friendId },
          { $pull: { friends: params.userId } },
          { new: true, runValidators: true }
        )
          .then((userFriend) => {
            if (!userFriend) {
              res.status(404).json({ message: 'No user with that friend ID' });
              return;
            }
            res.json({ message: 'Successfully deleted friend' });
          })
          .catch((err) => json(err));
      })
      .catch((err) => json(err));
  },
};

module.exports = userController;
