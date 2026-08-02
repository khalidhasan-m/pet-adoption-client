"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function PrivateRoute({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [session, isPending, router, pathname]);

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Verifying authentication..." />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return children;
}
