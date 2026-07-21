import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the passionate engineers, designers, and sustainability experts behind TerraForge.",
  openGraph: {
    title: "Our Team | TerraForge",
    description:
      "Diverse backgrounds, shared conviction. Meet the people building TerraForge.",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
