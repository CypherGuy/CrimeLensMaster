import { Request, Response } from "express";
export default function healthHandler(req: Request, res: Response) {
	res.status(200).json({
		"Message": `Server is up and running at ${new Date().toISOString().split("T")[0]}`,
	})

}