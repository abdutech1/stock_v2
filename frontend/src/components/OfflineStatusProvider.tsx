"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function OfflineStatusProvider() {
  useEffect(() => {
    const handleOnline = () => toast.success("Back online! Syncing data...");
    const handleOffline = () => toast.error("You are offline. Changes will be saved locally.", { duration: 5000 });

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null;
}