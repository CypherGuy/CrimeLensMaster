import { z } from "zod"


export const reportSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	location: z.string(),
	verified: z.boolean(),
	severity: z.number(),
	longitude: z.number(),
	latitude: z.number(),
	createdBy: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	mediaLinks: z.array(z.string()),
	likes: z.number(),
});


export type Report = z.infer<typeof reportSchema>