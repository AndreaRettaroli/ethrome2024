import { IExecDataProtector } from "@iexec/dataprotector";

export async function getOrCreateCollection({ wallet }: { wallet: any }) {
  const dataProtector = new IExecDataProtector(wallet);

  const collectionsResult = await dataProtector.sharing.getCollectionsByOwner({
    owner: wallet?.account.address,
  });
  console.log(
    "🚀 ~ getOrCreateCollection ~ wallet?.account.address:",
    wallet?.account.address
  );
  console.log(
    "🚀 ~ getOrCreateCollection ~ collectionsResult:",
    collectionsResult
  );

  if (collectionsResult.collections?.length > 0) {
    if (collectionsResult.collections?.length >= 2) {
      console.log(
        `It looks like you have more than one collection. The first one will be used. (id: ${collectionsResult.collections[0].id})`
      );
    }
    return collectionsResult.collections[0].id;
  }

  // onStatusUpdate({
  //   title: "Create user's first collection",
  //   isDone: false,
  // });
  const { collectionId: createdCollectionId } =
    await dataProtector.sharing.createCollection();
  console.log(
    "🚀 ~ getOrCreateCollection ~ createdCollectionId:",
    createdCollectionId
  );
  // onStatusUpdate({
  //   title: "Create user's first collection",
  //   isDone: true,
  //   payload: {
  //     createdCollectionId: String(createdCollectionId),
  //   },
  // });
  return createdCollectionId;
}
