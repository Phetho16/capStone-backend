import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    city,
    country,
    image,
    facilities,
    userEmail,
  } = req.body.data;

  try {
    const residency = await prisma.residency.upsert({
      where: { address_userEmail: { address, userEmail } },
      create: {
        title,
        description,
        price,
        address,
        city,
        country,
        image,
        facilities,
        owner: { connect: { email: userEmail } },
      },
      update: {
        title,
        description,
        price,
        city,
        country,
        image,
        facilities,
      },
    });

    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      res.status(400).send({ error: "A residency with this address and email already exists." });
    } else {
      res.status(500).send({ error: "Internal server error" });
    }
  }
});
export const getAllResidencies = asyncHandler(async(req,res) => {
    const residencies = await prisma.residency.findMany({
        orderBy:{ 
            createdAt:"desc"
        }
    })
    res.send(residencies)
})


export const getResidency = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  try {
    const residency = await prisma.residency.findUnique({
      where: {id},
    });
    res.send(residency)
  } catch (error) {
    throw new Error(error.message)
  }
})