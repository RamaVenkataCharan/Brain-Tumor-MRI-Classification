import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with TerraForge. Send us a message about your sustainability goals or partnership opportunities.",
  openGraph: {
    title: "Contact | TerraForge",
    description:
      "Have a question or project in mind? We'd love to hear from you.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
