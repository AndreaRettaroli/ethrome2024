"use client";

import useSubscriptionUser from "@/hooks/useSubscriptionUser";
import {
  CollectionWithProtectedDatas,
  IExecDataProtectorSharing,
  ProtectedDataInCollection,
} from "@iexec/dataprotector";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Placeholder,
  Spinner,
} from "@telegram-apps/telegram-ui";
import { Dispatch, SetStateAction, useState } from "react";

import { useConnect, useWalletClient } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Creator({ params }: { params: { address: string } }) {
  const { address } = params;
  const { connect } = useConnect();
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
  console.log("🚀 ~ Creator ~ allCollections:", allCollections);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {address ? (
        <>
          <div className="grow w-full justify-center align-center">
            <div className="relative w-full h-full flex justify-center align-center">
              {/* Background card using Telegram UI Card component */}
              <Card className="absolute -top-10 h-4/5 w-full opacity-[0.22] bg-gradient-to-r from-[#020024] via-[#090979] to-[#00d4ff]" />

              {/* Avatar using Telegram UI Avatar component */}
              <Avatar
                className="relative z-10  mt-20 size-[118px] border-4 border-[#D9D9D9]"
                size={96}
                src={`/avatars/Avatar1.png`}
              />
            </div>
            <div className="grow mb-20">
              <Placeholder
                description=""
                header={`Creator ${address.slice(0, 4)}...${address.slice(-4)}`}
              ></Placeholder>

              {isLoading && <Spinner size="l" />}
              {isError && <p>Error: {error.message}</p>}
              {isSuccess && (
                <ul>
                  {allCollections &&
                    allCollections.length > 0 &&
                    allCollections.map((collection) => (
                      <li key={collection.id}>
                        <Subscription collection={collection} />
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grow">
            <Placeholder
              action={
                <Button
                  size="l"
                  stretched
                  onClick={() => connect({ connector: injected() })}
                >
                  Connect
                </Button>
              }
              description="Join the best Telegram VIP betting community"
              header="Telegram VIP Betting"
            >
              <img
                width={100}
                height={100}
                alt="Telegram sticker"
                className="blt0jZBzpxuR4oDhJc8s"
                src="https://xelene.me/telegram.gif"
              />
            </Placeholder>
          </div>
        </>
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
      <Placeholder
        action={
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
            {isSubscription ? "Subscribed" : "Subscribe"}
          </Button>
        }
        description={
          isSubscription
            ? "Welcome on my VIP community contents"
            : "Subscribe to access to all my VIP community contents"
        }
      ></Placeholder>
      <Placeholder
        header="Contents"
        action={collection.protectedDatas.map((data, idx) => (
          <ProtectedData data={data} idx={idx + 1} key={data.id} />
        ))}
      />
    </>
  );
}

function ProtectedData({
  data,
  idx,
}: {
  data: ProtectedDataInCollection;
  idx: number;
}) {
  const { data: wallet } = useWalletClient();
  const [contentUrl, setContentUrl] = useState<string>("");
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
  console.log(
    "🚀 ~ protectedData:",
    protectedData,
    protectedData?.protectedDataPricingParams.address
  );
  return (
    <Card>
      <Card.Chip readOnly>{data.id}</Card.Chip>
      <img
        alt={`Content Card ${idx}`}
        src={contentUrl ? contentUrl : `/creator/Card${idx}.png`}
        style={{
          display: "block",
          height: 308,
          objectFit: "cover",
          width: "100%",
        }}
      />
      <Card.Cell readOnly>{data.name}</Card.Cell>
      <Card.Cell readOnly>
        <Download
          data={data}
          setContentUrl={setContentUrl}
          protectedData={protectedData?.protectedDataPricingParams.address}
        />
      </Card.Cell>
    </Card>
  );
}

function Download({
  data,
  setContentUrl,
  protectedData,
}: {
  data: ProtectedDataInCollection;
  setContentUrl: Dispatch<SetStateAction<string>>;
  protectedData: any;
}) {
  const { data: wallet } = useWalletClient();
  return (
    <Button
      onClick={async () => {
        const dataProtectorSharing = new IExecDataProtectorSharing(wallet);
        console.log("start download");
        // const protectedData = await dataProtectorSharing.consumeProtectedData({
        //   protectedData: data.id,
        //   app: "0x1cb7D4F3FFa203F211e57357D759321C6CE49921",
        //   path: data.name,
        // });
        const { taskId, result } =
          await dataProtectorSharing.consumeProtectedData({
            app: process.env.NEXT_PUBLIC_PROTECTED_DATA_DELIVERY_DAPP_ADDRESS!,
            protectedData: protectedData,
            path: "content",
            workerpool: process.env.NEXT_PUBLIC_WORKERPOOL_ADDRESS,
            onStatusUpdate: (status) => {
              console.log("🚀 ~ onClick={ ~ status:", status);
            },
          });
        console.log("🚀 ~ onClick={ ~ { taskId, result }:", { taskId, result });
        console.log("end download");
        const fileAsBlob = new Blob([result]);
        const fileAsObjectURL = URL.createObjectURL(fileAsBlob);
        setContentUrl(fileAsObjectURL);

        const url = window.URL.createObjectURL(fileAsBlob);
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
