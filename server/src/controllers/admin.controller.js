const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        companyId: user.companyId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.adminDashboard = async (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    adminId: req.user.userId,
    companyId: req.user.companyId,
  });
};

exports.getUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const users = await User.find({
      companyId: req.user.companyId,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ],
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, employeeId, password, role } = req.body;

    if (!name || !email || !employeeId || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.create({
      name,
      email,
      employeeId,
      password,
      role,
      companyId: req.user.companyId,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Failed to create user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    delete req.body.password;

    const user = await User.findOneAndUpdate(
      { _id: id, companyId: req.user.companyId },
      req.body,
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndDelete({
      _id: id,
      companyId: req.user.companyId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
