import { Link, Tabbar } from "@telegram-apps/telegram-ui";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export default function TabbarMenu() {
  const { address } = useAccount();
  const router = useRouter();
  const tabs = ["explore", "profile", "creators"];
  return (
    <footer>
      {address && (
        <Tabbar>
          {tabs.map((tab) => (
            <Tabbar.Item
              key={tab}
              text={tab}
              onClick={() => router.push(`/${tab != tabs[0] ? tab : ""}`)}
            />
          ))}
        </Tabbar>
      )}
    </footer>
  );
}
