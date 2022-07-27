const { User, Thought } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single thought
  getSingleThought({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a new thought
  createThought({ body }, res) {
    Thought.create(body)
      .then((thought) => {
        User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        )
          .then((thought) => {
            if (!thought) {
              res.status(404).json({ message: 'No user with that ID' });
              return;
            }
            res.json(thought);
          })
          .catch((err) => res.json(err));
      })
      .catch((err) => res.status(500).json(err));
  },
  // Update an existing thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
    })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.status(400).json(err));
  },
  // Delete a thought and associated reactions
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' });
          return;
        }
        User.findOneAndUpdate(
          { username: thought.username },
          { $pull: { thought: params.id } }
        )
          .then(() => {
            res.json({ message: 'Thought deleted successfully' });
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => res.status(400).json(err));
  },

  // Add a reaction to a thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.status(400).json(err));
  },
  // Delete a reaction from a thought
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { _id: params.reactionId } } },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' });
          return;
        }
        res.json({ message: 'Reaction successfully deleted' });
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = thoughtController;
