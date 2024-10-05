"use client";

import { useAccount, usePublicClient } from "wagmi";
import { IExecDataProtectorSharing } from "@iexec/dataprotector";

export default function Sub() {
  const client = usePublicClient();
  const { address } = useAccount();

  return (
    <button
      onClick={async () => {
        console.log("Sub");
        // Instantiate only the Sharing module
        const dataProtectorSharing = new IExecDataProtectorSharing(client);

        const result = await dataProtectorSharing.getCollectionsByOwner({
          owner: "0xcef59b0836e1f6a77c2684b727106d3f91d83402",
        });
        console.log(result)
      }}
    >
      Sub
    </button>
  );
}
