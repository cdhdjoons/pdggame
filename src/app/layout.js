
import { El_Messiri, Gajraj_One } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import Footer from "./components/footer";
import ClientOnlyWrapper from "./components/clientOnlyWarpper";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"


const gajraj = Gajraj_One({
  variable: "--font-gajraj",
  subsets: ["latin"],
  weight: '400',
});

export const metadata = {
  title: "JetFuel",
  description: "JetFuel_WepApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-black flex justify-center min-h-dvh m-0 p-0 ${gajraj.className}`} >
        <div className=" w-full max-w-[500px] max-h-[1080px] bg-cover bg-no-repeat relative flex flex-col justify-between overflow-hidden"
          style={{ backgroundImage: `url(/image/jet_bg.png)` }}>
            {children}
          <Analytics />
          <SpeedInsights />
          <ClientOnlyWrapper />
        </div>
      </body>
    </html>
  );
}
