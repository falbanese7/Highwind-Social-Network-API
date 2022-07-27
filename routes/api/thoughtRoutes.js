const router = require('express').Router();
const {
  getAllThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require('../../controllers/thoughtController');

// retrieves and creates new thoughts
router.route('/').get(getAllThoughts).post(createThought);

// retrieves, updates, deletes single thought
router
  .route('/:id')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

// creates and deletes reactions based on user's friends' id's
router
  .route('/:userId/friends/:friendId')
  .post(addReaction)
  .delete(deleteReaction);

module.exports = router;
