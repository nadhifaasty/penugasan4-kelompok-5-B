import { z } from "zod";

export const registrationSchema = z.object({
  eventId: z.number(),
  nama: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  nim: z.string().min(8, { message: "NIM tidak valid" }),
  email: z.string().email({ message: "Format email salah" }),
});