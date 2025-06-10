import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "JobSage+",
  description: "Analyse your professional journey to get on the next stage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Sessionwrapper>  */}
          <Navbar/>
          <main className="min-h-screen">
            {children}
          </main>
        
          <Footer />
        {/* /Sessionwrapper> */}
      </body>
    </html>
  );
}