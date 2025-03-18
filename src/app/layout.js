
import "./globals.css";
import ClientOnlyWrapper from "./components/clientOnlyWarpper";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "PDG",
  description: "PDG_WepApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-black flex justify-center min-h-dvh m-0 p-0 font-appleNeo`} >
        <div className=" w-full max-w-[500px] max-h-[1080px] bg-gradient-to-b from-[#BADA8E] to-[#2BAEB2] relative flex flex-col justify-between overflow-hidden"
          >
            {children}
          <Analytics />
          <SpeedInsights />
          <ClientOnlyWrapper />
        </div>
      </body>
    </html>
  );
}
