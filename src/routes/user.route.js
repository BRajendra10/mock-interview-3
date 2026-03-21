import { Router } from "express";
import { deleteUser, getAllUsers, login, searchUser, singup, updateUser } from "../controllers/user.controller.js";

const router = Router();



router.get("/", getAllUsers);
router.post("/signup", singup)
router.post("/login", login)
router.patch("/update", updateUser)

router.get("/search", searchUser)
router.get("/delete/:id", deleteUser)

export default router