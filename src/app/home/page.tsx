import Navbar from "@/components/common/Navbar";
import React from "react";


type Props = {};

export default function Home() {
  return (
    <>
      <Navbar />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </>
  );
}
