import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore TerraForge's sustainability services: carbon analytics, green infrastructure, strategy consulting, supply chain decarbonization, and more.",
  openGraph: {
    title: "Services | TerraForge",
    description:
      "End-to-end sustainability solutions — from measurement to transformation.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
