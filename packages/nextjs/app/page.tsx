"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { BuildType, OktoProvider } from "okto-sdk-react";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Map from "~~/components/Map";

const Home: NextPage = () => {
  return (
    <>
      <Map />
    </>
  );
};

export default Home;
