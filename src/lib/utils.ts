import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function urlToFile(url: string, filename: string): Promise<File> {
  // Primero, obtener la imagen como blob
  const response = await fetch(url);
  const blob = await response.blob();

  // Determinar el tipo MIME correcto
  const mimeType = response.headers.get("content-type") || "image/jpeg";

  // Crear un objeto File desde el blob
  return new File([blob], filename, { type: mimeType });
}
