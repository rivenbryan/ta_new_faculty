import React from "react";
import { signOut } from "next-auth/react"; // Import signOut from next-auth

type Props = {};

export default function Navbar({}: Props) {
  const navBarItems = [
    {
      name: "Home",
      link: "/home",
    },
    {
      name: "Ticket",
      link: "/ticket",
    },
    {
      name: "Task",
      link: "",
    },
    {
      name: "Student",
      link: "",
    },
    {
      name: "Class",
      link: "",
    },
    {
      name: "FAQ",
      link: "",
    },
  ];

  return (
    <div className="bg-blue-800 h-20 p-2"> {/* Adjust height and padding */}
      <div className="container flex justify-between items-center mx-auto">
        {/* Logo and University name */}
        <div className="flex items-center gap-2 max-h-14">
          <img src="/ntu.png" alt="Logo" className="w-10" /> {/* Adjust logo size */}
          <div className="text-xs text-white leading-tight"> {/* Ensure tight line spacing */}
            <p>NANYANG</p>
            <p>TECHNOLOGICAL</p>
            <p>UNIVERSITY</p>
            <p>SINGAPORE</p>
          </div>
        </div>

        {/* Navbar Links */}
        <div className="flex space-x-4 text-white">
          {navBarItems.map((item) => (
            <a href={item.link} key={item.name} className="hover:underline">
              {item.name}
            </a>
          ))}

          {/* Sign Out Button */}
          <button
            onClick={() => signOut()} // Call signOut to sign out the user
            className="hover:underline text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
