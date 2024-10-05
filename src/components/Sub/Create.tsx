import { IExecDataProtectorSharing } from "@iexec/dataprotector";
import { useAccount, useChainId, useChains, usePublicClient, useWalletClient } from "wagmi";

export default function CreateButton() {
    const result = useWalletClient()
    const chain = useChains()
    return (
        <button onClick={async () => {
            console.log("Create");
            // Instantiate only the Sharing module
            const dataProtectorSharing = new IExecDataProtectorSharing(result.data);
            console.log(result.data)
            console.log(chain)
    
            const createCollectionResult = await dataProtectorSharing.createCollection();
            console.log(createCollectionResult)
          }}
          >Create</button>
    )
}