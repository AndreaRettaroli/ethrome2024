import { http } from "wagmi";
import { createConfig } from "@privy-io/wagmi";
import {defineChain, serializeTransaction} from 'viem'

export const iXec = defineChain({
  id: 134,
  name: "iXec",
  nativeCurrency: { name: "xRLC", symbol: "xRLC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://bellecour.iex.ec"] },
  },
  blockExplorers: {
    default: {name: 'Explorer', url: 'https://explorer.iex.ec/bellecour'},
  },
  fees: {
    baseFeeMultiplier: 0,
    defaultPriorityFee: BigInt(0),
  },
  serializers: {
    transaction(transaction, signature) {
      return serializeTransaction(transaction, signature)
    },
  },
})

export const wagmiConfig = createConfig({
  chains: [iXec],
  transports: {
    [iXec.id]: http(),
  },
});
