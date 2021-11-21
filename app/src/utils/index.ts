export const formatMaskedWallet = (account: string): string => {
  const first = account.slice(0, 4);
  const last = account.slice(-4);
  return `${first}***${last}`;
};
