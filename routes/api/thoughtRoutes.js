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

// creates reactions based on thought id's
router.route('/:thoughtId/reactions').post(addReaction);

// deletes single reactions based on thought id's
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;
