export function getCardVisualNumber({ address }: { address: string }) {
  const matches = address.match(/\d/g);
  if (!matches?.[1] || matches[1] === "0") {
    return "card-visual-bg-1";
  }
  return `card-visual-bg-${matches[1]}`;
}

export function getAvatarVisualNumber({
  address,
}: {
  address: string | undefined;
}) {
  if (!address) {
    return "profile-avatar-bg-1";
  }
  const slicedAddress = address.slice(2);
  const digitGroups = [...slicedAddress.matchAll(/\d+/g)];
  const sum = digitGroups.reduce((accu, current) => {
    return accu + Number(current);
  }, 0);
  const chosenImageIndex = sum % 14;
  if (chosenImageIndex === 0) {
    return "profile-avatar-bg-1";
  }
  return `profile-avatar-bg-${chosenImageIndex}`;
}


export function rlcToNrlc(rlcValue: number) {
  return rlcValue * 10 ** 9;
}


export function daysToSeconds(days: number) {
  return days * 24 * 60 * 60;
}