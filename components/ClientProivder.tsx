"use client";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

interface ClerkProviderProps {
  children: React.ReactNode;
}
const ClientProvider = ({ children }: ClerkProviderProps) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default ClientProvider;
