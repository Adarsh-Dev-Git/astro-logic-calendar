import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UserProfile = {
  name?: string;      // display name
  birthDate: string;   // YYYY-MM-DD
  birthTime: string;   // HH:MM
  birthPlace: string;  // free text
};

export type UserSettings = {
  theme: "system" | "light" | "dark";
  notifications: boolean;
  timeZone: string;
};

type Ctx = {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  logout: () => void;
  settings: UserSettings;
  setSettings: (s: Partial<UserSettings>) => void;
};

const UserContext = createContext<Ctx | undefined>(undefined);

const defaultSettings: UserSettings = {
  theme: "system",
  notifications: false,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const raw = localStorage.getItem("userProfile");
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  });
  const [settings, setSettingsState] = useState<UserSettings>(() => {
    const raw = localStorage.getItem("userSettings");
    return raw ? { ...defaultSettings, ...(JSON.parse(raw) as UserSettings) } : defaultSettings;
  });

  useEffect(() => {
    if (profile) localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }, [settings]);

  const value = useMemo<Ctx>(() => ({
    profile,
    setProfile: (p) => setProfileState(p),
    logout: () => {
      localStorage.removeItem("userProfile");
      setProfileState(null);
    },
    settings,
    setSettings: (s) => setSettingsState((prev) => ({ ...prev, ...s })),
  }), [profile, settings]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
