import { z } from "zod";

export const bookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  guests: z.array(z.object({ email: z.string() })).superRefine((guests, ctx) => {
    guests.forEach((guest, index) => {
      if (guest.email && !z.string().email().safeParse(guest.email).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid guest email",
          path: [index, "email"],
        });
      }
    });
  }),
  notes: z.string().optional(),
});

export type BookingFormSchema = z.infer<typeof bookingFormSchema>;
