import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import "../styles/modern.css";
import { AuthProvider } from "../components/AuthContext";
import { ThemeProvider } from "../components/ThemeContext";
import { ThemeTransition } from "../components/ThemeTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NCERT Smartest",
  description: "Practice NCERT-based MCQs for Classes 1–12 by chapter. Instant test generation and score tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ncert-theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var initialTheme = theme || (systemPrefersDark ? 'dark' : 'light');
                  var html = document.documentElement;
                  
                  if (initialTheme === 'dark') {
                    html.classList.add('dark');
                    html.classList.remove('light');
                    html.setAttribute('data-theme', 'dark');
                    html.style.colorScheme = 'dark';
                  } else {
                    html.classList.remove('dark');
                    html.classList.add('light');
                    html.setAttribute('data-theme', 'light');
                    html.style.colorScheme = 'light';
                  }
                  console.log('[Script] Initial theme applied:', initialTheme, 'Classes:', html.className);
                } catch (e) {
                  console.error('[Script] Error applying initial theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <ThemeProvider>
            <ThemeTransition>
              <div className="flex-1 flex flex-col">
                {children}
              </div>
              <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-6 sm:mt-10 p-3 sm:p-4">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-medium text-sm sm:text-base">
                  <Link href="/resources" className="hover:underline px-2 text-gray-700 dark:text-blue-300 hover:text-gray-900 dark:hover:text-blue-200">Product Resources</Link>
                  <Link href="/company" className="hover:underline px-2 text-gray-700 dark:text-blue-300 hover:text-gray-900 dark:hover:text-blue-200">Company</Link>
                  <Link href="/legal" className="hover:underline px-2 text-gray-700 dark:text-blue-300 hover:text-gray-900 dark:hover:text-blue-200">Legal</Link>
                </div>
              </footer>
            </ThemeTransition>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
