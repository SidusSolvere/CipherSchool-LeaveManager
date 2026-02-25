const Company = require("../models/Company");

exports.registerCompany = async (req, res) => {
  try {
    const { name, emailDomain, governmentId } = req.body;

    if (
      !name ||
      !emailDomain ||
      !governmentId?.idType ||
      !governmentId?.idValue
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCompany = await Company.findOne({
      $or: [{ emailDomain }, { "governmentId.idValue": governmentId.idValue }],
    });

    if (existingCompany) {
      return res.status(409).json({
        message: "Company already registered",
      });
    }

    const company = await Company.create({
      name,
      emailDomain,
      governmentId,
    });

    res.status(201).json({
      message: "Company registered successfully",
      company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
