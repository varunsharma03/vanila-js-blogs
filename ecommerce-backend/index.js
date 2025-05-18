import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/allBlogs", async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        user: {
          select: {
            uuid: true,
            email: true,
            name: true,
          },
        },
      },
    });
    return res.status(200).json({ status: true, data: blogs });
  } catch (error) {
    return res.status(422).json({ status: false, message: error.message });
  }
});

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    await prisma.user.create({
      data: { name: name, email: email, password: password },
    });
    return res
      .status(200)
      .json({ status: true, message: "User Registered SuccessFully" });
  } catch (error) {
    return res.status(422).json({ status: false, message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await prisma.user.findFirst({
      where: { email: email },
      select: {
        name: true,
        email: true,
        uuid: true,
        password: true,
      },
    });
    console.log(userExist);
    console.log(password);
    if (!userExist || userExist.password != password) {
      throw new Error("Invalid Credentials");
    }
    delete userExist?.password;
    return res.status(200).json({ status: true, data: userExist });
  } catch (error) {
    return res.status(422).json({ status: false, message: error.message });
  }
});

app.post("/post/blog", async (req, res) => {
  try {
    const { userId, name, descriptions, imageUrl } = req.body;
    await prisma.blog.create({
      data: {
        name,
        descriptions,
        view: 0,
        like: 0,
        dislike: 0,
        user: { connect: { uuid: userId } },
        imageUrl,
      },
    });
    return res.status(200).json({ status: true, message: `Blog Posted !!!` });
  } catch (error) {
    return res.status(422).json({ status: false, message: error.message });
  }
});

app.get("/user/blogs", async (req, res) => {
  try {
    const userId = req.query.userId;
    const blogs = await prisma.blog.findMany({
      where: { user: { uuid: userId } },
    });
    return res.status(200).json({ status: true, data: blogs || [] });
  } catch (error) {
    return res.status(422).json({ status: false, message: error.message });
  }
});

app.post("/blog/details", async (req, res) => {
  try {
    const { blogId } = req.body;
    const blog = await prisma.blog.findUnique({
      where: { uuid: blogId },
      include: {
        comment: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        user: { select: { name: true, email: true } },
      },
    });
    return res.status(200).json({ status: true, data: blog || {} });
  } catch (error) {
    return res.status(422).json({ status: false, message: error.message });
  }
});

app.post("/add/comment", async (req, res) => {
  try {
    const { blogId, comment, userId } = req.body;
    await prisma.comment.create({
      data: {
        comment: comment,
        user: { connect: { uuid: userId } },
        blog: { connect: { uuid: blogId } },
      },
    });
    return res
      .status(200)
      .json({ status: true, message: "Comment Added Successfully" });
  } catch (error) {
    return res.status(422).json({ status: false, message: error.message });
  }
});

app.post("/update/blog", async (req, res) => {
  try {
    const { blogId, like, dislike } = req.body;
    console.log(blogId);
    await prisma.blog.update({
      where: { uuid: blogId },
      data: {
        ...(like && { like: { increment: 1 } }),
        ...(dislike && { dislike: { increment: 1 } }),
        view: { increment: 1 },
      },
    });
    return res.status(200).json({ status: true, message: "Status Updated" });
  } catch (error) {
    return res.status(422).json({ status: false, message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
