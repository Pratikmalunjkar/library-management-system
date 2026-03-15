const pool = require("../../config/db");
const { sendEmail } = require("../../utils/email");
const { generateToken } = require("../../utils/jwt");

// Generate 6 digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/*
=====================================
REQUEST OTP
=====================================
*/
const requestOtp = async ({ email, phone, full_name }) => {
  if (!email && !phone) {
    throw new Error("Email or phone is required");
  }

  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  let userQuery;
  let userValues;

  if (email) {
    userQuery = "SELECT * FROM users WHERE email = $1";
    userValues = [email];
  } else {
    userQuery = "SELECT * FROM users WHERE phone = $1";
    userValues = [phone];
  }

  const existingUser = await pool.query(userQuery, userValues);

  let userId;

  if (existingUser.rows.length === 0) {
    const insertUser = await pool.query(
      `INSERT INTO users (full_name, email, phone, user_role, is_active)
       VALUES ($1, $2, $3, 'USER', false)
       RETURNING id`,
      [full_name || "New User", email || null, phone || null]
    );

    userId = insertUser.rows[0].id;
  } else {
    userId = existingUser.rows[0].id;
  }

  // Delete old OTPs
  await pool.query(`DELETE FROM otps WHERE user_id = $1`, [userId]);

  // Insert new OTP
  await pool.query(
    `INSERT INTO otps (user_id, email, phone, otp_code, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, email || null, phone || null, otpCode, expiresAt]
  );

  // Send email
  if (email) {
    await sendEmail(
      email,
      "Your OTP Code - Library Management System",
      `Your OTP is: ${otpCode}. It expires in 5 minutes.`
    );
  }

  return {
    message: "OTP sent successfully",
  };
};

/*
=====================================
VERIFY OTP
=====================================
*/
const verifyOtp = async ({ email, phone, otp }) => {
  if (!otp) {
    throw new Error("OTP is required");
  }

  let query;
  let values;

  if (email) {
    query = `
      SELECT * FROM otps
      WHERE email = $1 AND otp_code = $2
      ORDER BY created_at DESC
      LIMIT 1
    `;
    values = [email, otp];
  } else if (phone) {
    query = `
      SELECT * FROM otps
      WHERE phone = $1 AND otp_code = $2
      ORDER BY created_at DESC
      LIMIT 1
    `;
    values = [phone, otp];
  } else {
    throw new Error("Email or phone is required");
  }

  const otpResult = await pool.query(query, values);

  if (otpResult.rows.length === 0) {
    throw new Error("Invalid OTP");
  }

  const otpRecord = otpResult.rows[0];

  if (otpRecord.is_verified) {
    throw new Error("OTP already used");
  }

  if (new Date() > otpRecord.expires_at) {
    throw new Error("OTP expired");
  }

  await pool.query(
    `UPDATE otps SET is_verified = true WHERE id = $1`,
    [otpRecord.id]
  );

  await pool.query(
    `UPDATE users SET is_active = true WHERE id = $1`,
    [otpRecord.user_id]
  );

  const userResult = await pool.query(
    `SELECT id, user_role, is_active FROM users WHERE id = $1`,
    [otpRecord.user_id]
  );

  const user = userResult.rows[0];

  if (!user.is_active) {
    throw new Error("User account is not active");
  }

  const token = generateToken({
    id: user.id,
    user_role: user.user_role,
  });

  return {
    message: "OTP verified successfully",
    token,
  };
};

/*
=====================================
LOGIN (placeholder)
=====================================
*/
const login = async () => {
  return {
    message: "Login implementation coming next",
  };
};

module.exports = {
  requestOtp,
  verifyOtp,
  login,
};
