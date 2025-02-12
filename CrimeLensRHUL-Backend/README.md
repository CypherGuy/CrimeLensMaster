# CrimeLensRHUL-Backend

## Verdn API

API-KEY =

## Report Schema

```ts
export const reportSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  verified: z.boolean(),
  severity: z.string(),
  longtitude: z.number(),
  latitude: z.number(),
  createdBy: z.string(),
  created_at: z.string(),
  pdated_at: z.string(),
  deleted_at: z.string().nullable(),
});
```

## API ROUTES

- **Get Route**  
  `/api/get-reports`
  `/api/gemini`

**USAGE**

```
{
  "action": "generate-question",
  "context": "The history of the internet"
}
```

- **Delete Route** /api/delete-report @ takes one arguement in the http://localhost:3000/api/delete-report/id=<REPORT_ID>
- **Upload Route** /api/upload/ @ takes the files that you want to upload
