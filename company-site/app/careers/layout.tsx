import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join TerraForge and work on problems that matter. Explore open roles in engineering, design, data, and sustainability.",
  openGraph: {
    title: "Careers | TerraForge",
    description:
      "Work on problems that matter. Join the team building tools for a sustainable future.",
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
