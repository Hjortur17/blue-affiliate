import { z } from "zod";

export const StatCardSchema = z.object({
  label: z.string(),
  value: z.string(),
  subtext: z.string(),
  subtextColor: z.enum(["green", "red", "muted"]).optional(),
});

export type StatCard = z.infer<typeof StatCardSchema>;

export const TopCarSchema = z.object({
  model: z.string(),
  bookings: z.number(),
});

export type TopCar = z.infer<typeof TopCarSchema>;
