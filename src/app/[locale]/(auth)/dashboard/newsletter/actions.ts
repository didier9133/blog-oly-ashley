"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";

const markHandledSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),
    notes: z.string().trim().max(2_000).optional(),
  })
  .strict();

export async function markHandledAction(params: {
  email: string;
  notes?: string;
}) {
  const parsed = markHandledSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("El correo electrónico no es válido.");
  }

  await prisma.newsletterSignup.update({
    where: { email: parsed.data.email },
    data: {
      handledAt: new Date(),
      notes: parsed.data.notes,
    },
  });

  revalidatePath("/dashboard/newsletter");
  return { success: true };
}
