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
          <h1 className="text-5xl font-bold">Box Office News!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
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
