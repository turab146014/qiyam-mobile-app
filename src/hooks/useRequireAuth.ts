import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { tokenStorage } from "../services/tokenStorage";

export const useRequireAuth = () => {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let isActive = true;

    const checkAuth = async () => {
      let refresh: string | null = null;

      try {
        refresh = await tokenStorage.getRefresh();
      } catch (error) {
        console.error("Unable to read stored session:", error);
      }

      if (!isActive) return;

      if (!refresh) {
        router.replace("/login");
        return;
      }

      setCheckingAuth(false);
    };

    checkAuth();

    return () => {
      isActive = false;
    };
  }, [router]);

  return checkingAuth;
};
