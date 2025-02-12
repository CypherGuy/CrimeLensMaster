import { Request, Response } from "express";
import { myDB } from "../db";

export default async function handlerDeleteReport(req: Request, res: any) {
  try {
    console.log("delete route hit");
    const reportId = (req.params.id as string).split("=")[1];
    const dbStore = new myDB();
    const myDbInstance = await dbStore.getDBInstance();
    if (!myDbInstance) {
      console.error("DB instance is not initialized");
      return res.status(500).send("Internal server error");
    }
    const reports = myDbInstance.collection("reports");
    const result = await reports.deleteOne({ id: reportId });
    if (result.deletedCount === 0) {
      return res.status(404).send("Report not found");
    }
    res.status(200).send("Report deleted successfully");
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
}
