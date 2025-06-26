import { SignUp } from "@clerk/nextjs";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
// This page will render the SignIn and SignUp components from Clerk.
