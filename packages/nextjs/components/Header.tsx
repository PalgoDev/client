"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoginButton } from "./GoogleSignIn";
import { PlayerChip, PlayerStats } from "./PlayerStats";
import { Address, Avatar, Badge, Identity, Name } from "@coinbase/onchainkit/identity";
import { jwtDecode } from "jwt-decode";
import { signOut, useSession } from "next-auth/react";
import { type OktoContextType, useOkto } from "okto-sdk-react";
import GoogleButton from "react-google-button";
import toast from "react-hot-toast";
import { Hex } from "viem";
import { Bars3Icon, BugAntIcon, HomeIcon, PowerIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { createUser } from "~~/actions/createUser";
import { fetchUser } from "~~/actions/fetchUser";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  { label: "Home", href: "/", icon: <HomeIcon className="h-4 w-4" /> },
  { label: "Leaderboard", href: "/leaderboard", icon: <TrophyIcon className="h-4 w-4" /> },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 z-10">
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-background hover:shadow-md focus:!bg-background active:!text-neutral py-1.5 px-3 text-md rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </div>
  );
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);

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
      if (response[0]?.wallet_address) {
        setPlayerStats(response[0]);
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

  const handleLogout = async () => {
    try {
      await logOut();
      await signOut();
      toast.success("Logged out successfully");
      setUserAddress(null);
    } catch (err) {
      toast.error("Error logging out");
    }
  };

  useEffect(() => {
    console.log("session changed", session);
  }, [session]);

  return (
    <div className="sticky lg:static top-0 navbar min-h-0 flex-shrink-0 justify-between z-20 py-2 shadow-secondary px-1">
      <div className="navbar-start w-auto lg:w-1/2 px-10">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:border-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prev => !prev);
              (document.getElementById("header_menu") as HTMLDialogElement).showModal();
            }}
          >
            <Bars3Icon className="h-3/4" />
          </label>
          {
            <dialog id="header_menu" className="modal">
              <div className="modal-box">
                {menuLinks.map(({ label, href, icon }) => {
                  return (
                    <Link
                      onClick={() => (document.getElementById("header_menu") as HTMLDialogElement).close()}
                      href={href}
                      key={href}
                      className="flex items-center gap-2 py-2"
                    >
                      {icon}
                      {label}
                    </Link>
                  );
                })}
                <div className="modal-action">
                  <button
                    className="bg-transparent hover:bg-gray-300 text-black border rounded-md border-red-500 px-4 py-2 transition-colors w-full"
                    onClick={() => (document.getElementById("header_menu") as HTMLDialogElement).close()}
                  >
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          }
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

        {/* <div>
          {playerStats?.wallet_address && (
            <Identity address={playerStats?.wallet_address as Hex}>
              <Avatar />{" "}
              <Name>
                <Badge />
              </Name>{" "}
              <Address />
            </Identity>
          )}
        </div> */}
      </div>
      <div className="navbar-end flex-grow mr-4 px-2">
        {session ? (
          playerStats ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => (document.getElementById("chains") as HTMLDialogElement).showModal()}
                className="bg-transparent hover:bg-gray-300 text-black border rounded-md border-gray-300 px-4 py-2 transition-colors"
              >
                Switch Chain
              </button>
              <dialog id="chains" className="modal">
                <div className="modal-box">
                  <div className="flex flex-col gap-2">
                    <ul className="list-none">
                      <li className="cursor-pointer hover:bg-gray-300 rounded-md px-2 py-1">Polygon</li>
                      <li className="cursor-pointer hover:bg-gray-300 rounded-md px-2 py-1">BSC</li>
                      <li className="cursor-pointer hover:bg-gray-300 rounded-md px-2 py-1">Ethereum</li>
                    </ul>
                    <div className="modal-action">
                      <button
                        className="bg-transparent hover:bg-gray-300 text-black border rounded-md border-red-500 px-4 py-2 transition-colors w-full"
                        onClick={() => (document.getElementById("chains") as HTMLDialogElement).close()}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </dialog>
              <PlayerChip
                wallet_address={playerStats.wallet_address}
                attack={playerStats.attack}
                defense={playerStats.defense}
                health={playerStats.health}
              />
            </div>
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
        {session && (
          <PowerIcon
            className="h-5 w-5 ml-4 cursor-pointer "
            color="red"
            onClick={() => {
              handleLogout();
            }}
          />
        )}
      </div>
    </div>
  );
};
