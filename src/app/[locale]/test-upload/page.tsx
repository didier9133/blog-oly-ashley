import type { Metadata } from "next";
import TestUploadClient from "./test-upload-client";

export const metadata: Metadata = {
  title: "Test Upload",
  robots: { index: false, follow: false },
};

export default function TestUploadPage() {
  return <TestUploadClient />;
}
