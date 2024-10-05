"use client";

import {
  Placeholder,
  Button,
  Card,
  Avatar,
  FileInput,
} from "@telegram-apps/telegram-ui";

import { IExecDataProtectorSharing } from "@iexec/dataprotector";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";

import { injected } from "wagmi/connectors";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function New() {
  const { address, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [file, setFile] = useState<File | undefined>();

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
            <div className="grow">
              <Placeholder
                description="Be a creator, upload your content"
                header={`${address.slice(0, 4)}...${address.slice(-4)}`}
              >
                <form>
                  <FileInput
                    multiple={false}
                    onChange={function noRefCheck() {}}
                  />
                  <Button
                    size="l"
                    stretched
                    onClick={() => connect({ connector: injected() })}
                  >
                    Submit
                  </Button>
                </form>
              </Placeholder>
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
        console.log("🚀 ~ queryFn: ~ collections:", collections);
        return collections;
      },
    });

    return (
      <div>
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
