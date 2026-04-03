import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Micro Tech Center | Empowering Future Through Technology",
  description: "Learn. Build. Transform. Join MicroTech Computer Center today.",
  icons: {
    icon: "/Microtech/mt_transparent.png",
    apple: "/Microtech/mt_transparent.png",
  },
};

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Righteous&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body>
        <Navbar />
        <main style={{ minHeight: '100vh' }}>
          {children}
        </main>
        <Footer />
        {/* Chatbase Widget Script */}
        <script
          id="chatbase-config"
          dangerouslySetInnerHTML={{
            __html: `
            window.chatbaseConfig = {
              chatbotId: "ZR4g-9X71Ne3BiiL4mN6I"
            };
          `,
          }}
        />
        <script
          id="chatbase-embed"
          src="https://www.chatbase.co/embed.min.js"
          defer
          data-chatbot-id="ZR4g-9X71Ne3BiiL4mN6I"
          data-domain="www.chatbase.co"
        />
      </body>
    </html>
  );
}
