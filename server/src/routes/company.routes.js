const express = require("express");
const { registerCompany } = require("../controllers/company.controller");

const router = express.Router();

router.post("/register", registerCompany);

module.exports = router;