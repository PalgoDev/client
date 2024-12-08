"use client";

import { useEffect, useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { BuildType, OktoProvider } from "okto-sdk-react";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { base } from "wagmi/chains";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={`flex flex-col min-h-screen `}>
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children, session }: { children: React.ReactNode; session: Session }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleGAuthCb() {
    if (session) {
      //@ts-ignore
      return session.id_token;
    }
    await signIn("google");
    return "";
  }

  return (
    <SessionProvider session={session}>
      <OnchainKitProvider apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY as string} chain={base as any}>
        <OktoProvider
          apiKey={process.env.NEXT_PUBLIC_OKTO_CLIENT_API!}
          buildType={BuildType.SANDBOX}
          gAuthCb={handleGAuthCb}
        >
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <ProgressBar height="3px" color="#2299dd" />
              <RainbowKitProvider
                avatar={BlockieAvatar}
                theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
              >
                <ScaffoldEthApp>{children}</ScaffoldEthApp>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </OktoProvider>
      </OnchainKitProvider>
    </SessionProvider>
  );
};
