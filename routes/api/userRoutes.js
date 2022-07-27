const router = require('express').Router();
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/userController');

// retrieves and creates new users
router.route('/').get(getAllUsers).post(createUser);

// retrieves, updates, deletes single users
router.route('/:id').get(getSingleUser).put(updateUser).delete(deleteUser);

// creates and deletes friends based on user's friends' id's
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;
