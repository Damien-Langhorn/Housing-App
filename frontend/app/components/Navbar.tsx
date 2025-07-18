"use client";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const Navbar = () => {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <nav>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link href={"/houses"} className="btn btn-ghost text-xl">
            Dream Homes
          </Link>
        </div>
        <div className="flex gap-8">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
          <div className="pr-4">
            {!isLoaded ? null : isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    userButtonBox: "w-10 h-10",
                    userButtonAvatarBox: "w-10 h-10",
                    userButtonAvatar: "w-10 h-10 rounded-full",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Homes"
                    labelIcon={<HomeIcon />}
                    href="/userHouses"
                  />
                  <UserButton.Link
                    label="Favorites"
                    labelIcon={<HeartIcon />}
                    href="/homes"
                  />
                  <UserButton.Link
                    label="Messages"
                    labelIcon={<ChatBubbleLeftRightIcon />}
                    href="/messages"
                  />
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <SignInButton mode="modal">
                <button className="btn btn-primary">Sign In</button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
