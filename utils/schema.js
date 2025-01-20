import {z} from "zod";


export const blinksSchema = z.object({
    blinks_summary: z.string(),
    blinks_name: z.string(),
    blinks_description: z.string(),
    blinks_url: z.string(),
    blinks_source: z.object()
})