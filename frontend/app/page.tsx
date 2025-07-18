"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row px-10">
        <Image
          src="/Hero-Image.jpg"
          width={500}
          height={500}
          alt="Box Office News"
          priority
          className="rounded-lg shadow-2xl shadow-base-content lg:w-[50vw]"
        />
        <div className="text-center text-balance lg:w-[50vw]">
          <h1 className="text-3xl sm:text-5xl font-bold py-6">
            Find the{" "}
            <span className="italic bg-gradient-to-r from-amber-900 via-yellow-600 to-amber-900 bg-clip-text text-transparent">
              House
            </span>
            <br />
            of Your{" "}
            <span className="italic bg-gradient-to-r from-amber-900 via-yellow-600 to-amber-900 bg-clip-text text-transparent">
              Dreams{" "}
            </span>{" "}
            with <br />
            <span className="italic bg-gradient-to-r from-amber-900 via-yellow-600 to-amber-900 bg-clip-text text-transparent">
              Affordable
            </span>{" "}
            Prices
          </h1>

          <Link href={"/houses"} className="btn btn-primary">
            Get Started
          </Link>
          <Link href={"/signIn"} className="btn btn-secondary ml-4">
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
}
