"use client";

import {
  Section,
  Cell,
  Image,
  List,
  Placeholder,
  Button,
  Tabbar,
} from "@telegram-apps/telegram-ui";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import Sub from "@/components/Sub/Sub";
import CreateButton from "@/components/Sub/Create";
import { injected } from "wagmi/connectors";
import { TabbarItem } from "@telegram-apps/telegram-ui/dist/components/Layout/Tabbar/components/TabbarItem/TabbarItem";

const tabs = ["profile", "subscriptions"];

export default function Home() {
  const { address, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {address ? (
        <>
          <div className="grow place-content-center">
            <p>
              Connected to {address} on {chain?.id}
            </p>
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
          <div>
            <Tabbar>
              {tabs.map((tab) => (
                <TabbarItem
                  text={tab}
                  onClick={() => alert("ciao")}
                ></TabbarItem>
              ))}
            </Tabbar>
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
                src="https://xelene.me/telegram.gif"
              />
            </Placeholder>
          </div>
        </>
      )}
    </div>
  );
}
