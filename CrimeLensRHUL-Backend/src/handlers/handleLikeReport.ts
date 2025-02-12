import { Request, Response } from "express";
import { myDB } from "../db";
import fetch from "node-fetch"; // Ensure you have node-fetch installed for making API calls
import { UUID } from "mongodb";

export default async function LikeReport(req: Request, res: any) {
  console.log("Like report route hit");
  const id = req.body.reportId;
  const userId = req.body.userId;
  const dbStore = new myDB();
  const myDbInstance = await dbStore.getDBInstance();

  if (!myDbInstance) {
    console.error("DB instance is not initialized");
    return res.status(500).json({ message: "Database error" });
  }

  const reportsCollection = myDbInstance.collection("reports");
  const treeCollection = myDbInstance.collection("treeCount"); // Assuming you have a trees collection
  const report = await reportsCollection.findOne({ id: id });

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  // Ensure likedBy is initialized as an array if it doesn't exist
  if (!report.likedBy) {
    report.likedBy = [];
  }

  const isAlreadyLiked = report.likedBy.includes(userId);
  let newLikes = report.likes;

  if (isAlreadyLiked) {
    // Dislike and remove user from likedBy
    newLikes = report.likes - 1;
    await reportsCollection.updateOne(
      { id: id },
      { $inc: { likes: -1 }, $pull: { likedBy: userId } }
    );
  } else {
    // Like and add user to likedBy
    newLikes = report.likes + 1;
    await reportsCollection.updateOne(
      { id: id },
      { $inc: { likes: 1 }, $push: { likedBy: userId } }
    );
  }

  // Update verified status based on the number of likes
  const isVerified = newLikes >= 2;
  await reportsCollection.updateOne(
    { id: id },
    { $set: { verified: isVerified } }
  );

  // If the report reaches more than 2 likes, call the external API and increment the user's tree count
  if (newLikes > 2 && !isAlreadyLiked) {
    try {
      // Call the external API
      const options = {
        method: "POST",
        headers: {
          Authorization:
            "Bearer verdn_sk_test_2jb58jfloksbl1q7idt1zopkvsjcz3p90zh88cugxe5cx70gxypsa8cyi5q",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pledges: [
            {
              impact: {
                amount: 1,
                offeringId: "io_01J4RSBX6KPQ4RYCRZ8C4QWRHF",
              },
            },
          ],
          recipient: {
            email: "pythonwithsean@gmail.com",
          },
          reference: new UUID().toString(),
        }),
      };

      const apiResponse = await fetch(
        "https://api.verdn.com/v2/pledge-transaction",
        options
      );
      const apiData = await apiResponse.json();
      console.log("API Response:", apiData);

      await treeCollection.updateOne(
        { userId: report.createdById },
        { $inc: { treeCount: 1 } }
      );
    } catch (error) {
      console.error(
        "Error calling external API or updating user tree count:",
        error
      );
    }
  }

  return res.status(200).json({
    message: isAlreadyLiked
      ? "Report disliked successfully"
      : "Report liked successfully",
    likes: newLikes,
    verified: isVerified,
  });
}
