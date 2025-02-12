import formidable, { IncomingForm } from "formidable";
import { Request, Response } from "express";
import { awsS3ClientService } from "../aws";

export default async function handleUpload(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).send("Method not allowed");
  }
  try {
    const form = new IncomingForm({
      allowEmptyFiles: true,
      keepExtensions: true,
      multiples: true,
    });
    const s3Instance = new awsS3ClientService();
    form.parse(
      req,
      async (err: any, fields: formidable.Fields, files: formidable.Files) => {
        if (err) {
          return res.status(500).send("Internal Server Error");
        }
        console.log(fields);
        const mediaFiles = files.media;
        if (!mediaFiles || mediaFiles?.length === 0) {
          return res.status(401).json({
            message: "No Media Files Provided",
          });
        }
        const urls: Array<string> = await Promise.all(
          mediaFiles.map(async (file: formidable.File) => {
            const key = `${Date.now()}-${file.originalFilename}`;
            const response = await s3Instance.uploadFile(key, file);
            return response.imageUrl; // Store the image URL
          })
        );
        return res.status(200).json({
          message: "File uploaded successfully",
          imageUrls: urls,
        });
      }
    );
  } catch (error: any) {
    console.error(error.message);
  }
}
