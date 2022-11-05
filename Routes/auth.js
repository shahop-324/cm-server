const express = require("express");

const router = express.Router();

// Middleware
const { loginAdmin, getAdmins, updateAdmin, deleteAdmin } = require("../Controller/authController");

router.post("/login", loginAdmin);
// router.get("/admin", getAdmins);
// router.patch("/update", updateAdmin);
// router.delete("/delete", deleteAdmin);

module.exports = router;