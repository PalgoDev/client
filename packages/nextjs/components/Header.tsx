"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoginButton } from "./GoogleSignIn";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useSession } from "next-auth/react";
import { type OktoContextType, type User, useOkto } from "okto-sdk-react";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },

  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const { data: session } = useSession();

  const {
    isLoggedIn,

    authenticate,
    authenticateWithUserId,
    logOut,
    getPortfolio,
    transferTokens,
    getWallets,
    createWallet,
    getSupportedNetworks,
    getSupportedTokens,
    getUserDetails,
    orderHistory,
    getNftOrderDetails,
    showWidgetModal,
    showOnboardingModal,
    getRawTransactionStatus,
    transferTokensWithJobStatus,
    transferNft,
    transferNftWithJobStatus,
    executeRawTransaction,
    executeRawTransactionWithJobStatus,
    setTheme,
    getTheme,
  } = useOkto() as OktoContextType;
  const idToken = useMemo(() => {
    console.log("session in header", session);
    return session
      ? //@ts-ignore
        session.id_token
      : null;
  }, [session]);

  async function handleAuthenticate(): Promise<any> {
    if (!idToken) {
      return;
    }
    const userId = jwtDecode(idToken).sub;
    if (!userId) {
      return;
    }
    return new Promise(resolve => {
      authenticate(idToken, (result: any, error: any) => {
        if (result) {
          console.log("Authentication successful", result);

          resolve({ result: true });
        } else if (error) {
          console.error("Authentication error:", error);
          resolve({ result: false, error });
        }
      });
    });
  }

  async function handleLogout() {
    try {
      logOut();
      return { result: "logout success" };
    } catch (error) {
      return { result: "logout failed" };
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      console.log("Okto is authenticated");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    console.log(session, "session");
    if (!isLoggedIn) {
      handleAuthenticate();
    }
  }, [session]);

  const handleCreateWallet = async () => {
    try {
      console.log("creating wallet");
      const res = await createWallet();
      console.log("create wallet res", res);
    } catch (err) {
      console.log("error creating wallet", err);
    }
  };

  return (
    <div className="sticky lg:static top-0 navbar min-h-0 flex-shrink-0 justify-between z-20 py-2 shadow-secondary px-4">
      <div className="navbar-start w-auto lg:w-1/2 px-10">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0 py-2">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Palgo</span>
            <span className="text-xs">Hunt, Trade, and Play on the Go</span>
          </div>
        </Link>
        {/* <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul> */}
      </div>
      <div className="navbar-end flex-grow mr-4 px-10">
        <button
          onClick={handleCreateWallet}
          className="bg-transparent hover:bg-gray-300 text-black border rounded-md border-gray-300 border-1 rounded px-4 py-2 transition-colors"
        >
          Create Wallet
        </button>
        <LoginButton />
      </div>
    </div>
  );
};
