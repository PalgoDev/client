"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoginButton } from "./GoogleSignIn";
import { jwtDecode } from "jwt-decode";
import { useSession } from "next-auth/react";
import { type OktoContextType, useOkto } from "okto-sdk-react";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { createUser } from "~~/actions/createUser";
import { fetchUser } from "~~/actions/fetchUser";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  { label: "Home", href: "/" },
  { label: "Debug Contracts", href: "/debug", icon: <BugAntIcon className="h-4 w-4" /> },
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

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const { isLoggedIn, authenticate, logOut, createWallet } = useOkto() as OktoContextType;

  const idToken = useMemo(
    () =>
      //@ts-ignore
      session?.id_token || null,
    [session],
  );

  const handleFetchUserDb = async () => {
    try {
      const response = await fetchUser({ email: session?.user?.email || "" });
      console.log("fetch user response from DB", response);
      if (response?.wallet_address) {
        setUserAddress(response.wallet_address);
      } else {
        setUserAddress(null);
      }
    } catch {
      setUserAddress(null);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      handleFetchUserDb();
    } else if (idToken) {
      const userId = jwtDecode(idToken).sub;
      authenticate(idToken, () => handleFetchUserDb());
    }
  }, [isLoggedIn, idToken]);

  const handleCreateWallet = async () => {
    try {
      const res = await createWallet();
      if (res.wallets?.[0]?.address) {
        const response = await createUser({
          wallet_address: res.wallets[0].address,
          email: session?.user?.email || "",
        });
        console.log("create user response", response);
        if (response) setUserAddress(res.wallets[0].address);
      }
    } catch (err) {
      console.error("Error creating wallet:", err);
    }
  };

  const truncatedAddress = useMemo(() => {
    if (!userAddress) return null;
    return `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
  }, [userAddress]);

  return (
    <div className="sticky lg:static top-0 navbar min-h-0 flex-shrink-0 justify-between z-20 py-2 shadow-secondary px-4">
      <div className="navbar-start w-auto lg:w-1/2 px-10">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => setIsDrawerOpen(prev => !prev)}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 py-2">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" fill src="/logo.svg" className="cursor-pointer" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Palgo</span>
            <span className="text-xs">Hunt, Trade, and Play on the Go</span>
          </div>
        </Link>
      </div>
      <div className="navbar-end flex-grow mr-4 px-10">
        {session ? (
          userAddress ? (
            <div className="bg-gray-100 px-4 py-2 rounded-md">{truncatedAddress}</div>
          ) : (
            <button
              onClick={handleCreateWallet}
              className="bg-transparent hover:bg-gray-300 text-black border rounded-md border-gray-300 px-4 py-2 transition-colors"
            >
              Create Wallet
            </button>
          )
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
};
