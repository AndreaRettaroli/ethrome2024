"use client";

import useSubscriptionUser from "@/hooks/useSubscriptionUser";
import { CollectionWithProtectedDatas, IExecDataProtectorSharing } from "@iexec/dataprotector";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@telegram-apps/telegram-ui";
import { useWalletClient } from "wagmi";

export default function Creators() {
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
          limit: 1000,
        });
      return collectionOwners.filter((owner) => owner.id === "0xcef59b0836e1f6a77c2684b727106d3f91d83402")
    },
  });

  return (
    <div>
      <h1>Creators</h1>
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
        const collections =
          await dataProtectorSharing.getCollectionsByOwner({
            owner,
          });
        console.log(collections.collections.at(0)?.subscriptionParams?.duration);
        return collections.collections;
      },
    });

    return (
      <div>
        <h1>Collections</h1>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error: {error.message}</p>}
        {isSuccess && (
          <ul>
            {allCollections.map((collection) => (
              <li key={collection.id}>
                {collection.id} {collection.creationTimestamp.toString()}
                <Subscription collection={collection} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

function Subscription({ collection }: { collection: CollectionWithProtectedDatas }) {
  const { collectionSubscriptionsUser, refetchSubscription } =
    useSubscriptionUser();
  const { data: wallet } = useWalletClient();
  const isSubscription = collectionSubscriptionsUser.find(
    (subscription) => subscription.collection.id === collection.id.toString()
  );
  console.log(collection);
  return (
    <span>
      {isSubscription ? (
        "Subscribed"
      ) : (
        <Button
          onClick={async () => {
            const dataProtectorSharing = new IExecDataProtectorSharing(wallet);
            const { txHash } = await dataProtectorSharing.subscribeToCollection({
              collectionId: collection.id, 
              price: 2,
              duration: 60 * 60 * 24 * 30 ,
            });
            console.log(txHash);
            refetchSubscription();
          }}
        >
          Subscribe
        </Button>
      )}
    </span>
  );
}
