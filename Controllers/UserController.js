const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const { token } = require("../Configs/JwtToken");
const generateToken = token;

// account creation function
const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(406)
        .json({ message: "Please Provide all the Necessary Info to Proceed" });
    }

    //Checking user already registered in DB
    const user = await User.findOne({ email: email });

    //if already registered
    if (user) {
      return res
        .status(409)
        .json({ message: "User already registered. Please try login" });
    }

    //if not found in db proceed to create account
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
//user login validation with DB and create JWT token
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      //Checking user already registered in DB
      const user = await User.findOne({ email });
      //if user already registered
      if (!user) {
        res
          .status(404)
          .json({ message: "User not found register before login" });
      } else {
        //Validating password for found user
        const passwordValidation = await bcrypt.compare(
          password,
          user.password
        );
        if (passwordValidation) {
          const token = await generateToken(user);
          user.token = token;
          await user.save();
          res.status(200).json({
            message: "Login Successfully",
            token: token,
          });
        } else {
          res
            .status(401)
            .json({ message: "unauthorized Check login Credential" });
        }
      }
    } else {
      res
        .status(406)
        .json({ message: "Please Provide all the Necessary Info to Proceed" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//user account details get function
const userAccountDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const accountDetails = {
      name: user.name,
      email: user.email || null,
      credits: user.credits,
    };

    res.status(200).json({ accountDetails });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//account update function
const userAccountUpdate = async (req, res) => {
  const { id } = req.params;

  const { name } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user account details
    user.name = name;
    user.updatedAt = new Date();

    await user.save();

    res
      .status(200)
      .json({ message: "User Account Detail Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userAccountUpdate,
  userAccountDetails,
};
