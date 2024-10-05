"use client";

import useSubscriptionUser from "@/hooks/useSubscriptionUser";
import { CollectionWithProtectedDatas, IExecDataProtectorSharing, ProtectedDataInCollection } from "@iexec/dataprotector";
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
    <>
    {collection.protectedDatas.map((data) => (
      <ProtectedData data={data} />
    ))}
    <span>
      {isSubscription ? (
        "Subscribed"
      ) : (
        <Button
          onClick={async () => {
            const dataProtectorSharing = new IExecDataProtectorSharing(wallet);
            const protectedData = await dataProtectorSharing.getProtectedDataPricingParams({
              protectedData: collection.protectedDatas.at(0)?.id as string,
            });
            console.log(protectedData.protectedDataPricingParams.collection?.subscriptionParams?.price);
            console.log(protectedData.protectedDataPricingParams.collection?.subscriptionParams?.duration);
            console.log(collection.id);
            const { txHash } = await dataProtectorSharing.subscribeToCollection({
              collectionId: collection.id, 
              price: protectedData.protectedDataPricingParams.collection?.subscriptionParams?.price as number,
              duration: protectedData.protectedDataPricingParams.collection?.subscriptionParams?.duration as number,
            });
            console.log(txHash);
            refetchSubscription();
          }}
        >
          Subscribe
        </Button>
      )}
    </span>
    </>
  );
}

function ProtectedData({ data }: { data: ProtectedDataInCollection }) {
  const { data: wallet } = useWalletClient();
  const { data: protectedData } = useQuery({
    queryKey: [data.id],
    queryFn: async () => {
      const dataProtectorSharing = new IExecDataProtectorSharing(wallet);
      const protectedData = await dataProtectorSharing.getProtectedDataPricingParams({
        protectedData: data.id,
      });
      return protectedData;
    },
  });
  console.log(protectedData?.protectedDataPricingParams.collection);
  return (
    <div>
      <h2>Protected Datas</h2>
      <p>{data.id}</p>
      <p>{data.name}</p>
    </div>
  );
}