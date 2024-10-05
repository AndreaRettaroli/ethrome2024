"use client";

import { Placeholder, Button } from "@telegram-apps/telegram-ui";

import { useAccount, useConnect, useDisconnect } from "wagmi";

import { injected } from "wagmi/connectors";

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
                  Connect Hello
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
        </>
      )}
    </div>
  );
}
