"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title text-error justify-center">
            Something went wrong!
          </h2>
          <p className="text-base-content/70">
            {error.message || "An unexpected error occurred"}
          </p>
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary" onClick={() => reset()}>
              Try again
            </button>
            <button
              className="btn btn-outline"
              onClick={() => (window.location.href = "/")}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
