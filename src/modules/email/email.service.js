import EmailModel from "../../DB/models/email.model.js";
import { asyncHandler } from "../../utils/response.js";
export const resendEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (user.confirmEmail) {
    return next(new Error("Email already verified", { cause: 400 }));
  }
  const emailToken = crypto.randomBytes(32).toString("hex");
  user.emailToken = emailToken;
  user.emailTokenExpire = Date.now() + 15 * 60 * 1000; 
  await user.save();
  const verifyLink = `http://localhost:3000/auth/verify/${emailToken}`;
  await resendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `<h3>Hello ${user.fullName},</h3>
           <p>Please verify your email by clicking this link:</p>
           <a href="${verifyLink}">${verifyLink}</a>`
  });
  return res.status(200).json({
    message: "Verification email resent successfully",
  });
});