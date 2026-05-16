import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "AWS Pattern Library — Fernando Azevedo",
  description:
    "A curated catalog of 22+ AWS reference architectures, each with diagram, ADR, services, Well-Architected pointers and cost notes.",
  authors: [{ name: "Fernando Francisco Azevedo", url: "https://fernando.moretes.com" }],
  openGraph: {
    title: "AWS Pattern Library",
    description: "Curated catalog of 22+ AWS reference architectures with ADRs and Mermaid diagrams.",
    url: "https://patterns.moretes.com",
    siteName: "AWS Pattern Library",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
