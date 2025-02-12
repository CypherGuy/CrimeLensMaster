import { Request, Response } from "express";
import { myDB } from "../db";

export default async function handleGetUnverifiedReports(
  req: Request,
  res: any
) {
  console.log("Getting unverified reports");
  try {
    const dbStore = new myDB();
    const myDbInstance = await dbStore.getDBInstance();
    if (!myDbInstance) {
      console.error("DB instance is not initialized");
    }
    const reportCollection = myDbInstance.collection("reports");
    const UverifiedReports = await reportCollection
      .find({
        verified: false,
      })
      .toArray();
    return res.status(200).json({
      reportData: UverifiedReports,
    });
  } catch (error: any) {
    console.error("Error in /api/get-verified-reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
