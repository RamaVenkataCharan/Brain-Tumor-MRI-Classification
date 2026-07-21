import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Inference Demo",
  description: "Upload an MRI scan to run real-time brain tumor classification with benchmarked deep learning models.",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
