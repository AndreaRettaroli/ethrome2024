"use client";

import useSubscriptionUser from "@/hooks/useSubscriptionUser";
import {
  CollectionWithProtectedDatas,
  IExecDataProtectorSharing,
  ProtectedDataInCollection,
} from "@iexec/dataprotector";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@telegram-apps/telegram-ui";
import { parseGwei } from "viem";
import { useWalletClient } from "wagmi";

export default function Creator({ params }: { params: { address: string } }) {
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
      const collections = await dataProtectorSharing.getCollectionsByOwner({
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

function Subscription({
  collection,
}: {
  collection: CollectionWithProtectedDatas;
}) {
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
              const dataProtectorSharing = new IExecDataProtectorSharing(
                wallet
              );
              const protectedData =
                await dataProtectorSharing.getProtectedDataPricingParams({
                  protectedData: collection.protectedDatas.at(0)?.id as string,
                });
              console.log(
                protectedData.protectedDataPricingParams.collection
                  ?.subscriptionParams?.price
              );
              console.log(
                protectedData.protectedDataPricingParams.collection
                  ?.subscriptionParams?.duration
              );
              console.log(collection.id);
              const { txHash } =
                await dataProtectorSharing.subscribeToCollection({
                  collectionId: collection.id,
                  price: Number(
                    protectedData.protectedDataPricingParams.collection
                      ?.subscriptionParams?.price
                  ),
                  duration: Number(
                    protectedData.protectedDataPricingParams.collection
                      ?.subscriptionParams?.duration
                  ),
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
      const protectedData =
        await dataProtectorSharing.getProtectedDataPricingParams({
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
      <Download data={data} />
    </div>
  );
}

function Download({ data }: { data: ProtectedDataInCollection }) {
  const { data: wallet } = useWalletClient();
  return (
      <Button
        onClick={async () => {
          const dataProtectorSharing = new IExecDataProtectorSharing(wallet);
          console.log("start download");
          const protectedData = await dataProtectorSharing.consumeProtectedData(
            {
              protectedData: data.id,
              app: "0x1cb7D4F3FFa203F211e57357D759321C6CE49921",
              path: data.name,
            }
          );
          console.log("end download");
          const arrayBuffer = protectedData.result;
          const blob = new Blob([arrayBuffer]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `${data.name}.bin`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }}
      >
        Download
      </Button>
  );
}
