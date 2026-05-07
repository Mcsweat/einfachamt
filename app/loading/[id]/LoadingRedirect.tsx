"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LoadingRedirectProps = {
  id: string;
};

export function LoadingRedirect({ id }: LoadingRedirectProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function readDocument() {
      try {
        const response = await fetch(`/api/documents/${id}/read`, {
          method: "POST",
        });
        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.error ?? "Der Brief konnte nicht gelesen werden.");
        }

        if (isMounted) {
          window.localStorage.setItem(`einfachamt:analysis:${id}`, "saved");
          router.push(`/analysis/${id}`);
        }
      } catch (readError) {
        if (isMounted) {
          setError(
            readError instanceof Error
              ? readError.message
              : "Der Brief konnte nicht gelesen werden.",
          );
        }
      }
    }

    readDocument();

    return () => {
      isMounted = false;
    };
  }, [id, router]);

  if (!error) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-5 z-30 mx-auto max-w-[430px] rounded-[1.4rem] bg-amber-50 p-4 text-base font-semibold leading-6 text-amber-900 shadow-soft">
      {error}
    </div>
  );
}
