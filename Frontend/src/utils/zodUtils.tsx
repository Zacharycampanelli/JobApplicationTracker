import { z } from "zod";

export const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null ? null : value),
  z.coerce.number().nullable().optional()
).optional();

export const optionalDate = z.preprocess(
  (value) => (value === "" || value === null ? null : value),
  z.coerce.date().nullable().optional()
).optional();

export const optionalText = z.preprocess(
  (value) => (value === null ? "" : value),
  z.string().optional()
).optional();

export const requiredDate = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.date({ error: "Date applied is required" })
);