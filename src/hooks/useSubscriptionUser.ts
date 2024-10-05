import { CollectionSubscription, IExecDataProtectorSharing } from "@iexec/dataprotector";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";

export default function useSubscriptionUser(): { collectionSubscriptionsUser: CollectionSubscription[], refetchSubscription: () => void } {
    const { data: wallet } = useWalletClient();
    const { address } = useAccount();
    const { data: subscription, isSuccess, refetch: refetchSubscription } = useQuery({
        queryKey: ['subscription-'+address],
        queryFn: async () => {
            const dataProtectorSharing = new IExecDataProtectorSharing(wallet);
            return dataProtectorSharing.getCollectionSubscriptions({
                subscriberAddress: address as `0x${string}`,
            });
        }
    })
    if (isSuccess) {
        return { collectionSubscriptionsUser: subscription.collectionSubscriptions, refetchSubscription };
    }
    return { collectionSubscriptionsUser: [], refetchSubscription };    
}
