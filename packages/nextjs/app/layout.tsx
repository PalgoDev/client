import { authOptions } from "./api/auth/[...nextauth]/route";
import "@rainbow-me/rainbowkit/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { Toaster } from "react-hot-toast";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Palgo",
  description: "Hunt, Trade, and Play on the Go",
});

const ScaffoldEthApp = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  return (
    <html suppressHydrationWarning>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
          <ThemeProvider defaultTheme="light">
            <ScaffoldEthAppWithProviders session={session ?? ({} as Session)}>{children}</ScaffoldEthAppWithProviders>
            <Toaster />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
