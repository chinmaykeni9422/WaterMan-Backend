import { Router } from "express";
import { loginUser, logoutUser, registerUser, moistSensorData } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").get(verifyJWT ,logoutUser)

// dashboard page
router.route("/dashboard").get(verifyJWT, (req, res) => {
    // res.send(req.user);
})

export default router;