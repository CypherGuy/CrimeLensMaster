import { Request, Response } from "express";
import axios from "axios";

export default async function handleAutocomplete(req: Request, res: Response) {
	try {
		const { input } = req.query;
		const response = await axios.get(
			`https://maps.googleapis.com/maps/api/place/autocomplete/json`,
			{
				params: {
					input,
					types: "(regions)",
					key: process.env.GOOGLE_MAPS_API_KEY,
				},
			}
		);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({ error: "Error fetching data" });
	}
}