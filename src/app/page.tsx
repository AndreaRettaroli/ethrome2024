"use client";

import { daysToSeconds } from "@/utils/utils";
import { getOrCreateCollection } from "@/utils/getOrCreateCollection";
import { rlcToNrlc } from "@/utils/utils";
import { IExecDataProtectorSharing } from "@iexec/dataprotector";
import { Placeholder, Button, Card, Avatar } from "@telegram-apps/telegram-ui";
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";

import { injected } from "wagmi/connectors";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { address, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <>
      {address ? (
        <Profile />
      ) : (
      <div className="flex flex-col items-center justify-center min-h-screen">
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
            description="Join the best Telegram VIP communities experience"
            header="Telegram VIP Communities"
          >
            <img
              width={100}
              height={100}
              alt="Telegram sticker"
              src="https://xelene.me/telegram.gif"
            />
        </Placeholder>
          </div>
        </div>
      )}
    </>
  );
}

function Profile() {
  const { address, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: wallet } = useWalletClient();
  const router = useRouter();

  const copyToClipboard = () => {
    const textToCopy = `https://localhost:3000/creator/${address}`;

    navigator.clipboard.writeText(textToCopy).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  const enableSubscription = async () => {
    const dataProtectorSharing = new IExecDataProtectorSharing(wallet);
    const collectionId = await getOrCreateCollection({
      wallet: wallet,
    });
    const res = await dataProtectorSharing.setSubscriptionParams({
      collectionId: collectionId,
      price: rlcToNrlc(Number(10)),
      duration: daysToSeconds(Number(28)),
    });
    console.log("🚀 ~ enableSubscription ~ res:", res);
  };

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
                className="relative z-10 mb-10 mt-20 size-[118px] border-4 border-[#D9D9D9]"
                size={96}
                src={`/avatars/Avatar1.png`}
              />
            </div>
            <div className="grow mb-20">
              <Placeholder
                action={
                  <Button size="l" stretched onClick={copyToClipboard}>
                    Share Creator Profile
                  </Button>
                }
                description="Let others join your VIP contents community"
                header={`${address.slice(0, 4)}...${address.slice(-4)}`}
              />

              <Placeholder
                action={
                  <Button size="l" stretched onClick={enableSubscription}>
                    Enable Subcriptions
                  </Button>
                }
                description="Allow users to subscribe your contents"
                header={``}
              />

              <Placeholder
                action={
                  <Button
                    size="l"
                    stretched
                    onClick={() => router.push("/new")}
                  >
                    Create Content
                  </Button>
                }
                description="Be a creator, upload your content"
                header={``}
              />
              <Placeholder
                description=""
                header={`Your Contents`}
                action={<MyContents owner={address as `0x${string}`} />}
              ></Placeholder>

              <Placeholder
                action={
                  <Button size="l" stretched onClick={() => disconnect()}>
                    Disconnect
                  </Button>
                }
              />
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

  function MyContents({ owner }: { owner: `0x${string}` }) {
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
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error: {error.message}</p>}
        {isSuccess && (
          <ul>
            {allCollections &&
              allCollections.length > 0 &&
              allCollections[0].protectedDatas.map(
                (item: any, index: number) => {
                  const imgIdx = (index % 10) + 1;
                  console.log("🚀 ~ MyContents ~ imgIdx:", imgIdx);

                  return (
                    <li key={item.id}>
                      <Card>
                        <Card.Chip readOnly>{item.name}</Card.Chip>
                        <img
                          alt={`card content ${imgIdx}`}
                          src={`/creator/Card${imgIdx}.png`}
                          style={{
                            display: "block",
                            height: 308,
                            objectFit: "cover",
                            width: "100%",
                          }}
                        />
                        <Card.Cell readOnly>{item.name}</Card.Cell>
                      </Card>
                    </li>
                  );
                }
              )}
          </ul>
        )}
      </div>
    );
  }
}
