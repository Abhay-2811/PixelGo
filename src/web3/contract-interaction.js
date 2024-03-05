import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { bscTestnet } from 'viem/chains';

import { ca, abis } from './constants/constants';
const private_key = process.env.EXPO_PUBLIC_PRIVATE_KEY;
const account = privateKeyToAccount(private_key);

const BACKEND_URL = 'https://brainy-yak-pleat.cyclic.app/';

// this will be used for all sponsor based wallet based interactions on chain
export const owner_wallet = createWalletClient({
  account: account,
  chain: bscTestnet,
  transport: http(),
});

export const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(),
});

//get user nft balance
export const user_nft_balance = async address => {
  const data = publicClient.readContract({
    address: ca.myNFT,
    abi: abis.myNFT,
    functionName: 'balanceOf',
    args: [address],
  });
  return data;
};

//possible tokens for first mint
export const possible_Tokens = async () => {
  const response = await fetch(BACKEND_URL + 'possible_tokens');
  const data = await response.json();
  console.log(data.res);
  return data.res;
};

//Mint fresh nft
export const mint_first = async (tokenID, address) => {
  const hash = await owner_wallet.writeContract({
    address: ca.pixels,
    abi: abis.pixels,
    functionName: 'mintNFT',
    args: [tokenID, address],
  });

  await publicClient.waitForTransactionReceipt({
    hash: hash,
  });
};

// need name tokenid
export const nft_owned = async address => {
  const response = await fetch(BACKEND_URL + 'nft_owned', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({ address: address }),
  });
  const data = await response.json();
  return data.res;
};

//get listings of NFT, need tokenId and salePrice
export const get_listings = async () => {
  const response = await fetch(BACKEND_URL + 'get_listings');
  const data = await response.json();
  console.log(data.res);
  return data.res;
};
// buy
export const pay_for_nft = async (tokenID, wc, price) => {
  const [account] = await wc.getAddresses();
  const { request } = await publicClient.simulateContract({
    account,
    address: ca.pixels,
    abi: abis.pixels,
    functionName: 'buy_pixel',
    args: [Number(tokenID)],
    value: Number(price),
  });
  const hash = await wc.writeContract(request);
  await publicClient.waitForTransactionReceipt({
    hash,
  });
};

//before listing owner must approve nft to contract
export const approve_nft = async (tokenID, wc) => {
  const [account] = await wc.getAddresses();
  const { request } = await publicClient.simulateContract({
    account,
    address: ca.myNFT,
    abi: abis.myNFT,
    functionName: 'approve',
    args: [ca.pixels, Number(tokenID)],
  });
  const hash = await wc.writeContract(request);
  const txn = await publicClient.waitForTransactionReceipt({
    hash,
  });
  return txn.status === 'success' ? true : false;
};

// list
export const list_nft = async (tokenID, wc, price) => {
  const [account] = await wc.getAddresses();
  const { request } = await publicClient.simulateContract({
    account,
    address: ca.pixels,
    abi: abis.pixels,
    functionName: 'list_pixel',
    args: [Number(tokenID), Number(price)],
  });
  const hash = await wc.writeContract(request);
  await publicClient.waitForTransactionReceipt({
    hash,
  });
};
