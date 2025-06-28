import { parse } from "date-fns";
import { z } from "zod";

export const generateAiReportSchema = z.object({
	month: z.string().refine((value) => {
		const parsed = parse(value, "MM", new Date());
		return !isNaN(parsed.getTime());
	}),
	year: z.string().refine((value) => {
		const parsed = parse(value, "yyyy", new Date());
		return !isNaN(parsed.getTime());
	}),
});

export type GenerateAiReportSchema = z.infer<typeof generateAiReportSchema>;
