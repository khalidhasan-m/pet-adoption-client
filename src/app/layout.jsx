import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "PawfectMatch — Find Your Forever Furry Friend",
  description: "Browse available pets for adoption, submit adoption requests, and help pets find loving homes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.9rem",
                  borderRadius: "12px",
                },
              }}
            />
            <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
