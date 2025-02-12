import { Request, Response } from "express";
import axios from "axios";
import { Report, reportSchema } from "../schemas/report.schema";
import { myDB } from "../db";
import { UUID } from "mongodb";

function validateReport(report: any) {
	if (!(report.title) || !(report.description) || !(report.location)) {
		return false;
	}
	return true;
}

async function getCoordinates(location: string) {
	try {
		const response = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${location}&country=England`, {
			headers: {
				'X-Api-Key': process.env.API_NINJAS_KEY
			}
		});
		if (response.data && response.data.length > 0) {
			const { latitude, longitude } = response.data[0];
			return { latitude, longitude };
		} else {
			throw new Error("No coordinates found for the given location");
		}
	} catch (error) {
		throw new Error(`Failed to get coordinates: ${error instanceof Error ? error.message : String(error)}`);
	}
}
export default async function handleCreateReport(req: Request, res: any) {
	console.log(req.body);
	try {
		if (!req.body) {
			throw new Error("Request body is required");
		}
		if (!validateReport(req.body)) {
			throw new Error("Invalid report object");
		}

		const { location } = req.body;
		const { latitude, longitude } = await getCoordinates(location);

		const reportInsertObject: Report = {
			...req.body,
			name: req.body.title,
			mediaLinks: req.body.media ? req.body.media : [],
			createdById: req.body.userId,
			id: new UUID().toString(),
			latitude,
			longitude,
			severity: 0,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			verified: false,
			likes: 0,
			likedBy: [],
		};

		const myDb = new myDB();
		const dbInstance = await myDb.getDBInstance();
		const reportCollection = dbInstance.collection("reports");
		await reportCollection.insertOne(reportInsertObject);

		console.log("Report created successfully");
		return res.status(201).json({
			message: "Report created successfully",
			report: reportInsertObject
		});
	} catch (error: any) {
		console.error(error.message);
		return res.status(400).json({
			message: error.message
		});
	}
}