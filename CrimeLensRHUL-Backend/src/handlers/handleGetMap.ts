import { Request, Response } from "express";
import { myDB } from "../db";

const handleGetMap = async (req: Request, res: Response): Promise<void> => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  console.log("Fetching map locations...");

  try {
    const dbStore = new myDB();
    const myDbInstance = await dbStore.getDBInstance();
    if (!myDbInstance) {
      console.error("DB instance is not initialized");
      res.status(500).json({ message: "Database not initialized" });
      return;
    }

    const reports = myDbInstance.collection("reports");
    const reportsData = await reports.find({}).limit(200).toArray();

    // Extract only coordinates from reports
    const locations = reportsData
      .filter((report: any) => report.coordinates)
      .map((report: any) => ({
        lat: report.coordinates.lat,
        lng: report.coordinates.lng,
        title: report.title || "Unknown Location",
      }));

    res.status(200).json({ locations });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

export default handleGetMap;
