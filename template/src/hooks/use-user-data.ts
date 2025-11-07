"use client"

import { authClient } from "@/lib/authentication/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Session } from "better-auth";

type DeviceType = "Phone" | "Tablet" | "Desktop" | "Unknown";
type BrowserType = "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera" | "Brave" | "Chromium" | "Unknown";
type SystemType = "Windows" | "macOS" | "Linux" | "Android" | "iOS" | "Unknown"


export function useUserData() {
  function getDeviceType(session: Session): DeviceType {
    const ua = session.userAgent?.toLowerCase() ?? "";
    if (/iphone|android.*mobile|windows phone/.test(ua)) return "Phone";
    if (/ipad|android(?!.*mobile)|tablet|kindle|silk/.test(ua)) return "Tablet";
    if (/windows nt|macintosh|x11|linux/i.test(ua)) return "Desktop";
    return "Unknown";
  }
  function getSystemType(session: Session): SystemType {
    const ua = session.userAgent?.toLowerCase() ?? "";

    if (ua.includes("windows")) return "Windows";
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return "iOS";
    if (ua.includes("macintosh")) return "macOS";
    if (ua.includes("android")) return "Android";
    if (ua.includes("linux")) return "Linux";
    
    return "Unknown";
  }
  function getBrowserType(session: Session): BrowserType {
    const ua = session.userAgent?.toLowerCase() ?? "";
    if (ua.includes("edg/") || ua.includes("edga/")) return "Edge";
    if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
    if (ua.includes("firefox/")) return "Firefox";
    if (ua.includes("chromium/")) return "Chromium";
    if (ua.includes("chrome/") && !ua.includes("edg/") && !ua.includes("opr/")) return "Chrome";
    if (ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("chromium/")) return "Safari";
    
    return "Unknown";
  }
  const query = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const [accounts, sessions, user, passkeys, subscription] = await Promise.all([
        authClient.listAccounts(),
        authClient.listSessions(),
        authClient.getSession(),
        authClient.passkey.listUserPasskeys(),
        authClient.subscription.list()
      ]);
      const activeSessions = sessions?.data?.map((session) => ({
        ...session, 
        current: session.id === user?.data?.session.id,
        device: getDeviceType(session),
        browser: getBrowserType(session),
        system: getSystemType(session)
      }))
      return {
        accounts: accounts, 
        sessions: activeSessions, 
        user: user.data?.user, 
        passkeys: passkeys.data, 
        subscription: subscription.data ? subscription.data.find((sub) => sub.status === "active") : null
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000
  });

  return {
    accounts: query.data?.accounts.data ?? [],
    sessions: query.data?.sessions ?? [],
    user: query.data?.user ?? null,
    passkeys: query.data?.passkeys ?? [],
    subscription: query.data?.subscription ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export type UserData = ReturnType<typeof useUserData>
