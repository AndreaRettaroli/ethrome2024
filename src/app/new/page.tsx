"use client";

import {
  Placeholder,
  Button,
  Card,
  Avatar,
  FileInput,
  Text,
  Switch,
  Spinner,
} from "@telegram-apps/telegram-ui";

import {
  IExecDataProtector,
  createArrayBufferFromFile,
} from "@iexec/dataprotector";
import { useAccount, useConnect, useWalletClient } from "wagmi";

import { useState } from "react";
import { getOrCreateCollection } from "@/utils/getOrCreateCollection";
import { useRouter } from "next/navigation";
import { useLogin } from "@privy-io/react-auth";

export default function New() {
  const { address, chain } = useAccount();
  const { login } = useLogin();
  const { data: wallet } = useWalletClient();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, setToggle] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0]; // Only allows one file (multiple={false})
    setSelectedFile(file);
    console.log("🚀 ~ handleFileChange ~ file:", selectedFile);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const dataProtector = new IExecDataProtector(wallet);
      if (selectedFile) {
        const fileAsArrayBuffer = await createArrayBufferFromFile(selectedFile);
        const protectedFileAddress = await dataProtector.core.protectData({
          data: { file: fileAsArrayBuffer },
          name: selectedFile?.name ?? "",
          // onStatusUpdate: (status) => {
          //   keepInterestingStatusUpdates(onStatusUpdate, status);
          // },
        });
        console.log(
          "🚀 ~ handleSubmit ~ protectedFileAddress:",
          protectedFileAddress
        );
        // 2- Get or create collection
        const collectionId = await getOrCreateCollection({
          wallet: wallet,
        });
        console.log("🚀 ~ handleSubmit ~ collectionId:", collectionId);

        // 3- Add to collection

        const res = await dataProtector.sharing.addToCollection({
          protectedData: protectedFileAddress.address,
          collectionId,
          addOnlyAppWhitelist:
            process.env.NEXT_PUBLIC_DATA_DELIVERY_WHITELIST_ADDRESS!,
          onStatusUpdate: (status) => {
            if (status.title === "APPROVE_COLLECTION_CONTRACT") {
              const title =
                "Approve DataProtector Sharing smart-contract to manage this protected data";
              console.log("🚀 ~ handleSubmit ~ title:", title);
            } else if (status.title === "ADD_PROTECTED_DATA_TO_COLLECTION") {
              const title = "Add protected data to your collection";
              console.log("🚀 ~ handleSubmit ~ title:", title);
            }
          },
        });
        console.log("🚀 ~ handleSubmit ~ dataProtector:", res);
        if (true) {
          const res =
            await dataProtector.sharing.setProtectedDataToSubscription({
              protectedData: protectedFileAddress.address,
            });
          console.log("🚀 ~ handleSubmit ~ res:", res);
        }
        router.push("/");
      }
    } catch (e) {
      console.error("🚀 ~ handleSubmit ~ e:", e);
    } finally {
      setIsLoading(false);
    }
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
                className="relative z-10  mt-20 size-[118px] border-4 border-[#D9D9D9]"
                size={96}
                src={`/avatars/Avatar1.png`}
              />
            </div>
            <div className="grow">
              <Placeholder
                description="Be a creator, upload your content"
                header={`${address.slice(0, 4)}...${address.slice(-4)}`}
              ></Placeholder>
            </div>
            <Placeholder description="Your protected data will have the public name of your downloaded file.">
              {isLoading ? (
                <Spinner size="l" />
              ) : (
                <form className="flex flex-col justify-center items-center gap-4">
                  {selectedFile && (
                    <Text weight="1">{selectedFile.name ?? ""}</Text>
                  )}
                  <FileInput
                    multiple={false}
                    onChange={(e) => handleFileChange(e)}
                  />
                  <div className="flex flex-row gap-2">
                    <Text>{toggle ? "With Subscription" : "Free"}</Text>
                    <Switch
                      onChange={(e) => setToggle((prev) => !prev)}
                      checked={toggle}
                      defaultChecked={toggle}
                    />
                  </div>
                  <Button
                    size="l"
                    stretched
                    disabled={!selectedFile}
                    onClick={(e) => handleSubmit()}
                  >
                    Submit
                  </Button>
                </form>
              )}
            </Placeholder>
          </div>
        </>
      ) : (
        <>
          <div className="grow">
            <Placeholder
              action={
                <Button size="l" stretched onClick={() => login()}>
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
