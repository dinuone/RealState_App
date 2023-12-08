import User from "../Models/User.model.js";

export const Signup = async (req, res) => {

  const {username, email, password} = req.body;

  const newUser = new User({username,email,password});
  await newUser.save();

  res.status(200).json({message:"User Created successfully"})
}