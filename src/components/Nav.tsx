"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl flex items-center justify-between px-6 py-3 rounded-full bg-lineaYellow shadow text-black dark:text-black">
      <span className="font-bold">
        LINEA<sup>®</sup>
      </span>
      <ul className="flex gap-8 text-sm">
        <li>
          <Link href="#explore" className="hover:opacity-70">
            Explore
          </Link>
        </li>
        <li>
          <Link href="#build" className="hover:opacity-70">
            Build
          </Link>
        </li>
        <li>
          <Link href="#resources" className="hover:opacity-70">
            Resources
          </Link>
        </li>
        <li>
          <Link href="#about" className="hover:opacity-70">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
