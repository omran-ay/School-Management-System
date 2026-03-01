const express = require("express");
const UserController = require("../controllers/users/users.controller");
const authContoller = require("../controllers/auth/auth.controller");
const verifyToken = require("../middlewares/verfiyToken");
const { validateUser } = require("../middlewares/validations/user.validation");
const { validateUserUpdate } = require("../middlewares/validations/userUpdate");
const router = express.Router();
const allowedTo = require("../middlewares/allowedTo");
//Users
router
  .route("/")
  .get(verifyToken, allowedTo("Admin"), UserController.GetAllUsers);
router.route("/register").post(
  // validateUser(),
  authContoller.Registration
);
router.route("/login").post(authContoller.Login);
router.route("/forgotPassword").post(authContoller.ForgotPassword);
router
  .route("/reset-password/:user_id/:token")
  .post(authContoller.ResetPassword);

router
  .route("/:userId")
  .get(verifyToken, UserController.GetSingleUser)
  .patch(validateUserUpdate(), verifyToken, UserController.UpdateUser)
  .delete(verifyToken, allowedTo("Admin"), UserController.DeleteUser);

module.exports = router;
