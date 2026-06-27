"use server";

import { revalidatePath } from "next/cache";
import { markNewsletterSignupHandled } from "@/app/[locale]/actions/newsletter";

export async function markHandledAction(params: {
  email: string;
  notes?: string;
}) {
  const result = await markNewsletterSignupHandled(params);
  revalidatePath("/dashboard/newsletter");
  return result;
}
