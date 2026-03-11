import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cássio Sousa | Staff Software Engineer",
  description:
    "Staff Software Engineer specialized in distributed systems, SaaS platforms and cloud architectures.",
  openGraph: {
    title: "Cássio Sousa",
    description: "Staff Software Engineer",
    url: "https://cassiossousa.vercel.app",
    siteName: "Cássio Sousa",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#content">
          Skip to content
        </a>

        <Navbar />

        <main id="content">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
