"use client";

import useSubscriptionUser from "@/hooks/useSubscriptionUser";
import { CollectionWithProtectedDatas, IExecDataProtectorSharing } from "@iexec/dataprotector";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@telegram-apps/telegram-ui";
import { useWalletClient } from "wagmi";

export default function Creator({params}: {params: {address: string}}) {
  const { address } = params;
  const { data: wallet } = useWalletClient();
    const {
      isLoading,    
      isSuccess,
      data: allCollections,
      isError,
      error,
    } = useQuery({
      queryKey: [address],  
      queryFn: async () => {
        const dataProtectorSharing = new IExecDataProtectorSharing(wallet);
        const collections =
          await dataProtectorSharing.getCollectionsByOwner({
            owner: address,
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

function Subscription({ collection }: { collection: CollectionWithProtectedDatas }) {
  const { collectionSubscriptionsUser, refetchSubscription } =
    useSubscriptionUser();
  const { data: wallet } = useWalletClient();
  const isSubscription = collectionSubscriptionsUser.find(
    (subscription) => subscription.collection.id === collection.id.toString()
  );
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
              price: collection.subscriptionParams?.price as number,
              duration: collection.subscriptionParams?.duration as number,
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

