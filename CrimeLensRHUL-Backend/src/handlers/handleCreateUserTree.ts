import { Request, Response } from 'express';
import { myDB } from '../db';

export default async function handleCreateUserTree(req: Request, res: any) {
	try {
		console.log("Tree route hit");
		console.log(req.body);
		const dbStore = new myDB();
		const myDbInstance = await dbStore.getDBInstance();
		if (!myDbInstance) {
			console.error("DB instance is not initialized");
		}

		const treeCountCollection = myDbInstance.collection("treeCount");
		// check if user Tree already exists
		const treeCount = await treeCountCollection.countDocuments({
			"userId": req.body.userId
		})
		if (treeCount > 0) {
			res.status(400).json({ message: "User tree already exists" });
			return;
		}
		const newUserTree = {
			userId: req.body.userId,
			treeCount: 0
		}
		await treeCountCollection.insertOne(newUserTree);
		return res.status(200).json({ message: "User tree created" });

	} catch (error: any) {
		console.error("Error in /api/create-user-tree:", error);
		res.status(500).json({ message: "Internal server error" });
	}

}