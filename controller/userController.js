import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';  


export const createUser = asyncHandler(async (req, res) => {
  console.log("Creating a user");

  let { email, password } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email: email } });

  if (!userExists) {
    const user = await prisma.user.create({ data: { email, password } });

    res.status(201).json({
      message: "User registered successfully",
      user: user,
    });
  } else {
    res.status(400).json({ message: "User already registered" });
  }
});
