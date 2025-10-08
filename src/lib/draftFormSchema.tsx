import * as z from "zod"
  export const draftFormSchema = z.object({
email: z.email()
});