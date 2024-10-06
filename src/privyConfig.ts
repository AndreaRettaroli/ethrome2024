import type { PrivyClientConfig } from "@privy-io/react-auth";
import { iXec } from "./wagmiConfig";

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    noPromptOnSignature: true,
    waitForTransactionConfirmation: true,
  },
  defaultChain: iXec,
  supportedChains: [iXec],
  loginMethods: ["email", "wallet"],
  appearance: {
    showWalletLoginFirst: true,
  },
};
