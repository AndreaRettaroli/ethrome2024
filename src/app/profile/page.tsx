"use client";

import {
  Placeholder,
  Button,
  Card,
  Avatar,
  Text,
} from "@telegram-apps/telegram-ui";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import Sub from "@/components/Sub/Sub";
import CreateButton from "@/components/Sub/Create";
import { injected } from "wagmi/connectors";
import { getAvatarVisualNumber, getCardVisualNumber } from "@/utils/utils";

export default function Profile() {
  const { address, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  //   const cardVisualBg = getCardVisualNumber({ address: address as string });
  //   const avatarVisualBg = getAvatarVisualNumber({ address: address as string });
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
                action={
                  <Button
                    size="l"
                    stretched
                    onClick={() => connect({ connector: injected() })}
                  >
                    Create Content
                  </Button>
                }
                description="Be a creator, upload your content"
                header={`${address.slice(0, 4)}...${address.slice(-4)}`}
              />
            </div>
            <div className="grow">
              <Placeholder
                description=""
                header={`Your Contents`}
              ></Placeholder>
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

// import { createFileRoute, Outlet } from '@tanstack/react-router';
// import { useUserStore } from '@/stores/user.store';
// import { getAvatarVisualNumber } from '@/utils/getAvatarVisualNumber';
// import { getCardVisualNumber } from '@/utils/getCardVisualNumber';
// import { Avatar, Card, NavMenu } from '@telegram-apps/telegram-ui'; // Importing Telegram UI components

// export const Route = createFileRoute("/_explore/_profile")({
//   component: ProfileLayout,
// });

// export function ProfileLayout() {
//   //const { address: userAddress } = useUserStore(); // Getting user address

//   const cardVisualBg = getCardVisualNumber({ address: userAddress as string });
//   const avatarVisualBg = getAvatarVisualNumber({
//     address: userAddress as string,
//   });

//   return (
//     <div className="relative">
//       {/* Background card using Telegram UI Card component */}
//       <Card
//         className="absolute -top-40 mb-14 h-[228px] w-full rounded-3xl opacity-[0.22]"
//         style={{
//           backgroundImage: `url(${cardVisualBg})`,
//           backgroundSize: "100% 100%",
//           backgroundPosition: "center",
//         }}
//       />

//       {/* Avatar using Telegram UI Avatar component */}
//       <Avatar
//         className="relative z-10 mb-10 mt-20 size-[118px] border-4 border-[#D9D9D9]"
//         size={40}
//         src={avatarVisualBg}
//       />

//       {/* Profile navigation menu */}
//       <NavMenu>
//         <NavMenu.Item text="Overview" />
//         <NavMenu.Item text="Posts" />
//         <NavMenu.Item text="Settings" />
//       </NavMenu>

//       {/* Outlet for nested routes
//       <div className="mt-8">
//         <Outlet />
//       </div> */}
//     </div>
//   );
// }
