import { Noto_Serif, Source_Sans_3, Dancing_Script } from "next/font/google";

export const fontSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const fontSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const fontCursive = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-cursive",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const fontVariables = `${fontSans.variable} ${fontSerif.variable} ${fontCursive.variable}`;
