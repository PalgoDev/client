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
      <OktoProvider apiKey={process.env.NEXT_PUBLIC_OKTO_CLIENT_API_KEY as string} buildType={BuildType.SANDBOX}>
        <Map />
      </OktoProvider>
    </>
  );
};

export default Home;
