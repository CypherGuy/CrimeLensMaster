import { Request, Response } from "express";
import { myDB } from "../db";

export default async function handleGetReports(req: Request, res: Response) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"]);
		res.status(405).json({
			"message": "Method not allowed"
		});
	}
	console.log("Getting reports");
	try {
		const dbStore = new myDB()
		const myDbInstance = await dbStore.getDBInstance();
		if (!myDbInstance) {
			console.error("DB instance is not initialized");
		}
		const reports = myDbInstance.collection("reports");
		const reportsData = await reports.find({}).limit(200).toArray();
		res.status(200).json(reportsData);

	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
}