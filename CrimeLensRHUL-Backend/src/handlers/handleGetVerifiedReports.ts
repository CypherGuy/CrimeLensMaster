import { Request, Response } from "express";
import { myDB } from "../db";


export default async function handleGetVerifiedReports(req: Request, res: any) {
	console.log("Getting verified reports");
	try {
		const dbStore = new myDB();
		const myDbInstance = await dbStore.getDBInstance();
		if (!myDbInstance) {
			console.error("DB instance is not initialized");
		}
		const reportCollection = myDbInstance.collection("reports");
		const verifiedReports = await reportCollection.find({
			"verified": true
		}).toArray();
		return res.status(200).json({
			reportData: verifiedReports
		});
	} catch (error: any) {
		console.error("Error in /api/get-verified-reports:", error);
		res.status(500).json({ message: "Internal server error" });
	}

}