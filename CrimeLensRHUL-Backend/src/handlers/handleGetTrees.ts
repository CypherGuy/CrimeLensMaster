import { Request, Response } from "express";
import { myDB } from "../db";

export default async function handleGetTrees(req: Request, res: any) {
  try {
    console.log(req.query);
    const dbStore = new myDB();
    const myDbInstance = await dbStore.getDBInstance();
    if (!myDbInstance) {
      console.error("DB instance is not initialized");
    }
    const treeCountCollection = myDbInstance.collection("treeCount");
    const userTreeCount = await treeCountCollection.findOne({
      userId: req.query.userId,
    });
    if (!userTreeCount) {
      console.log("User not found, creating new user");
      treeCountCollection.insertOne({
        userId: req.query.userId,
        treeCount: 0,
      });
      return res.status(200).json({
        userId: req.query.userId,
        treeCount: 0,
      });
    }
    return res.status(200).json(userTreeCount);
  } catch (error: any) {
    console.error("Error in /api/create-user-tree:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
