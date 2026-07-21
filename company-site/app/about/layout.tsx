import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about TerraForge's founding story, mission, values, and the team behind our sustainability platform.",
  openGraph: {
    title: "About TerraForge",
    description:
      "Learn about TerraForge's founding story, mission, values, and the team behind our sustainability platform.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
