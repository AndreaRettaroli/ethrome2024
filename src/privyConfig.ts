import type { PrivyClientConfig } from "@privy-io/react-auth";
import { iXec } from "./wagmiConfig";

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
    noPromptOnSignature: true,
  },
  defaultChain: iXec,
  supportedChains: [iXec],
  loginMethods: ["email"],
  appearance: {
    showWalletLoginFirst: true,
  },
};
