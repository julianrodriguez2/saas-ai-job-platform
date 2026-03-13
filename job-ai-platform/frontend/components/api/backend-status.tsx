"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

interface UsersResponse {
  id?: string;
  email?: string;
}

export function BackendStatus() {
  const [text, setText] = useState("Loading backend response...");

  useEffect(() => {
    const run = async () => {
      try {
        const data = await apiClient.get<UsersResponse>("/users/me");

        if (data.email) {
          setText(`Authenticated as ${data.email}`);
          return;
        }

        setText("Backend responded.");
      } catch (error) {
        if (error instanceof Error) {
          setText(`API error: ${error.message}`);
          return;
        }
        setText("API error: unexpected failure.");
      }
    };

    run();
  }, []);

  return <p className="rounded-md border border-border bg-panel p-3 text-sm text-muted">{text}</p>;
}
