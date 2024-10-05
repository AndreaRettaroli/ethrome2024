import { http } from "wagmi";
import { createConfig } from "@privy-io/wagmi";
import { type Chain } from "viem";

export const iXec = {
  id: 134,
  name: "iXec",
  nativeCurrency: { name: "xRLC", symbol: "xRLC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://bellecour.iex.ec"] },
  },
} as const satisfies Chain;

export const wagmiConfig = createConfig({
  chains: [iXec],
  transports: {
    [iXec.id]: http(),
  },
});
