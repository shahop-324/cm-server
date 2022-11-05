const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const otpGenerator = require("otp-generator");

// Utils
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Model

const Admin = require("../Model/admin");
const User = require("../Model/user");
const { sendEmail } = require("../utils/sendMail");

// this function will return you jwt token
const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET);

// login Admin

exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const admin_doc = await Admin.findOne({ email, password });

  if (admin_doc) {
    const token = signToken(admin_doc._id, "admin");

    res.status(200).json({
      status: "success",
      message: "Logged In Successfully!",
      token,
      admin: admin_doc,
    });
  } else {
    res.status(400).json({
      status: "error",
      message: "Invalid Email or Password",
    });
  }
});

exports.protectAdmin = catchAsync(async (req, res, next) => {
  // Step 1: => Getting token and checking if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError(`You are not logged in! Please log in to get access`, 401)
    );
  }

  // Step 2: => Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Step 3: => Check if Admin still exists
  const admin_doc = await Admin.findById(decoded.id);

  if (!admin_doc) {
    return next(
      new AppError(
        "The admin belonging to this token does no longer exists.",
        401
      )
    );
  }
  // 4) Check if admin changed password after the token was issued
  if (admin_doc.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "This Admin has recently changed password! Please log in again.",
        401
      )
    );
  }
  // * ACCESS GRANTED
  // GRANT ACCESS TO PROTECTED ROUTE
  req.admin = admin_doc;
  req.id = decoded.id;
  next();
});

// create user request

exports.createUserRequest = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  const existing_user = await User.findOne({
    email: email.toString().toLowerCase(),
  });
  if (existing_user) {
    // check if mail is verified
    if (existing_user.emailVerified) {
      // throw error => this email is already registered, please login
      res.status(400).json({
        status: "erorr",
        message: "Email is already registered, Please login.",
      });
    } else {
      // generate & send verification otp via mail
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      sendEmail({
        recipient: email,
        sender: "verify@codingmonk.in",
        subject: "OTP for Verifying your CodingMonk account",
        text: `Your OTP to verify your CodingMonk account is ${otp}`,
        attachments: [],
      });
      // update existing_user name & otp
      await User.findOneAndUpdate(
        {
          email: email.toString().toLowerCase(),
        },
        { firstName, lastName, otp }
      );
      res.status(200).json({
        status: "Success",
        message: "OTP Sent Successfully!",
        data: email,
      });
    }
  } else {
    // generate & send verification otp via mail
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    sendEmail({
      recipient: email,
      sender: "verify@codingmonk.in",
      subject: "OTP for Verifying your CodingMonk account",
      text: `Your OTP to verify your CodingMonk account is ${otp}`,
      attachments: [],
    });
    // update existing_user name & otp
    await User.create({ firstName, lastName, otp, email });
    res.status(200).json({
      status: "Success",
      message: "OTP Sent Successfully!",
      data: email,
    });
  }
});

// send otp

exports.sendOtp = catchAsync(async (req, res, next) => {
  // reason can be => login, register
  const { reason, email } = req.body;

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  await User.findOneAndUpdate({ email }, { otp });

  sendEmail({
    recipient: email,
    sender: "verify@codingmonk.in",
    subject:
      reason === "register"
        ? "OTP for Verifying your CodingMonk account"
        : "OTP to log into your CodingMonk account",
    text: `Your OTP to ${
      reason === "register" ? "verify " : "logging into "
    } your CodingMonk account is ${otp}`,
    attachments: [],
  })
    .then((sid) => {
      console.log(sid);
      res.status(200).json({
        status: "success",
        message: "OTP sent successfully!",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        status: "error",
        message: "Failed to send OTP, please try again.",
      });
    });
});

// verify user email

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { otp, email } = req.body;
  const user_doc = await User.findOne({ email });
  if (!user_doc) {
    // throw error => bad request
    res.status(400).json({
      status: "error",
      message: "Bad request, No user found.",
    });
  } else {
    if (user_doc.otp === otp) {
      // user verified => mark email as verified
      user_doc.emailVerified = true;
      const updated_user = await user_doc.save({
        new: true,
        validateModifiedOnly: true,
      });
      const token = signToken(updated_user._id, "user");
      res.status(200).json({
        status: "success",
        message: "",
      });
    } else {
      // throw error => invalid otp
      res.status(400).json({
        status: "error",
        message: "Invalid OTP entered.",
      });
    }
  }
});

// login user

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user_doc = await User.findOne({ email });

  if (!user_doc) {
    res.status(400).json({
      status: "error",
      message: "No account found with given email.",
    });
  } else {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await User.findOneAndUpdate({ email }, { otp });

    sendEmail({
      recipient: email,
      sender: "verify@codingmonk.in",
      subject: "OTP for logging into your CodingMonk account",
      text: `Your OTP to log into your CodingMonk account is ${otp}`,
      attachments: [],
    })
      .then((sid) => {
        console.log(sid);
        res.status(200).json({
          status: "success",
          message: "OTP sent successfully!",
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({
          status: "error",
          message: "Failed to send OTP, please try again.",
        });
      });
  }
});

// protect user

exports.protectUser = catchAsync(async (req, res, next) => {
  // Step 1: => Getting token and checking if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError(`You are not logged in! Please log in to get access`, 401)
    );
  }

  // Step 2: => Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Step 3: => Check if Admin still exists
  const user_doc = await User.findById(decoded.id);

  if (!user_doc) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exists.",
        401
      )
    );
  }
  // * ACCESS GRANTED
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user_doc;
  req.id = decoded.id;
  next();
});
