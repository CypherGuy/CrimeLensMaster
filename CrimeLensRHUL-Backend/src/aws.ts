import dotenv from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import formidable from "formidable";
import { createReadStream, fstat } from "fs";

dotenv.config();

export class awsS3ClientService {
  private client;
  private bucketName: string;
  private region: string;
  private accessKey: string;
  private secretKey: string;

  constructor() {
    if (!process.env.MY_AWS_REGION) {
      throw new Error("Environment variable MY_AWS_REGION is not defined");
    }
    if (!process.env.MY_AWS_ACCESS_KEY) {
      throw new Error("Environment variable MY_AWS_ACCESS_KEY is not defined");
    }
    if (!process.env.MY_AWS_SECRET_KEY) {
      throw new Error("Environment variable MY_AWS_SECRET_KEY is not defined");
    }
    if (!process.env.MY_AWS_BUCKET_NAME) {
      throw new Error("Environment variable MY_AWS_BUCKET_NAME is not defined");
    }
    console.log("S3ClientService LOADED");
    this.accessKey = process.env.MY_AWS_ACCESS_KEY;
    this.secretKey = process.env.MY_AWS_SECRET_KEY;
    this.region = process.env.MY_AWS_REGION;
    this.bucketName = process.env.MY_AWS_BUCKET_NAME;

    this.client = new S3Client({
      region: this.region,
      endpoint: `https://s3.${this.region}.amazonaws.com`,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  async uploadFile(
    key: string,
    file: formidable.File
  ): Promise<{ imageUrl: string; response: any }> {
    console.log("Uploading file to S3");
    console.log("File", file.filepath);
    const fileBuffer = createReadStream(file.filepath);
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: file.mimetype as string,
    };
    try {
      const imageUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      console.log(imageUrl);
      const command = new PutObjectCommand(params);
      const response = await this.client.send(command);
      console.log("File uploaded successfully", response);
      return { imageUrl, response };
    } catch (e: any) {
      console.error(e.message);
      return { imageUrl: "", response: e };
    }
  }
}
