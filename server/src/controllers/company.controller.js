const Company = require("../models/Company");
const User = require("../models/User");

exports.registerCompany = async (req, res) => {
  try {
    const { name, emailDomain, governmentId } = req.body;

    const company = await Company.create({
      name,
      emailDomain,
      governmentId,
    });

    const adminEmail = `{emailDomain}`;
    const employeeId = `ADMIN-${Date.now()}`;
    const crypto = require("crypto");
    const rawPassword = crypto.randomBytes(6).toString("hex");
    const adminUser = await User.create({
      name: "Company Admin",
      email: adminEmail,
      employeeId,
      password: rawPassword,
      role: "ADMIN",
      companyId: company._id,
    });

    res.status(201).json({
      message: "Company registered successfully",
      company,
      adminCredentials: {
        email: adminEmail,
        password: rawPassword,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Company registration failed",
      error: error.message,
    });
  }
};
