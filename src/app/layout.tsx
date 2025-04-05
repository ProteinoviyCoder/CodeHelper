"use client";

import "@/app/globals.css";
import { ReactNode } from "react";
import { Providers } from "./provider";
import { Header } from "@/widgets/ui/header/header";
import { Sidebar } from "@/widgets/ui/sidebar/sidebar";
import { Main } from "@/widgets/ui/main/main";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/features/themeProvider/ui/provider/provider";
import { AuthProvider } from "@/features/authProvider/ui/authProvider";

type RootLayoutProps = {
  children: ReactNode;
};

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "300", "600"] });

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body className={poppins.className}>
        <Providers>
          <AuthProvider>
            <ThemeProvider>
              <Header></Header>
              <div className="wrapper">
                <div className="wrapper-container">
                  <Sidebar></Sidebar>
                  <Main>{children}</Main>
                </div>
              </div>
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
