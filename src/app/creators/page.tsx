"use client";

import { IExecDataProtectorSharing } from "@iexec/dataprotector";
import { useQuery } from "@tanstack/react-query";
import { WalletClient } from "viem";
import { useWalletClient } from "wagmi";

export default function Subscriptions() {
  const { data: wallet } = useWalletClient();
  const {
    isLoading,
    isSuccess,
    data: firstTenAccounts,
    isError,
    error,
  } = useQuery({
    queryKey: ["allCreators"],
    queryFn: async () => {
      const dataProtectorSharing = new IExecDataProtectorSharing(wallet);
      const { collectionOwners } =
        await dataProtectorSharing.getCollectionOwners({
          limit: 8,
        });
      return collectionOwners;
    },
  });

  return (
    <div>
      <h1>Subscriptions</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error.message}</p>}
      {isSuccess && (
        <ul>
          {firstTenAccounts.map((owner: any) => (
            <li key={owner.id}>
              <p>{owner.id}</p>
              <Collections owner={owner.id as `0x${string}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  function Collections({ owner }: { owner: `0x${string}` }) {
    const { data: wallet } = useWalletClient();
    const {
      isLoading,
      isSuccess,
      data: allCollections,
      isError,
      error,
    } = useQuery({
      queryKey: ["allCollections-" + owner],
      queryFn: async () => {
        const dataProtectorSharing = new IExecDataProtectorSharing(wallet);
        const { collections } =
          await dataProtectorSharing.getCollectionsByOwner({
            owner,
          });
        return collections;
      },
    });

    return (
      <div>
        <h1>Collections</h1>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error: {error.message}</p>}
        {isSuccess && (
          <ul>
            {allCollections.map((collection: any) => (
              <li key={collection.id}>
                {collection.id} {collection.creationTimestamp.toString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
