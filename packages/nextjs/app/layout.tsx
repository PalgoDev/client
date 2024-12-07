import "@rainbow-me/rainbowkit/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Toaster } from "react-hot-toast";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Palgo",
  description: "Hunt, Trade, and Play on the Go",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
          <ThemeProvider enableSystem>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
            <Toaster />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
