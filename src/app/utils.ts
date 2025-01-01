import { bn, BN, Input, Output, TransactionResult } from "fuels";

type TransactionInput = Input & {
  assetId: string;
  amount: BN;
  owner: string;
};
type TransactionOutput = Output & {
  owner?: string;
  to?: string;
  amount: BN;
  assetId: string;
};

export const getInputsSentByUser = (
  transaction: TransactionResult,
  userAddress: string
) => {
  if (!transaction) return [];

  const inputs = transaction.transaction.inputs as TransactionInput[];

  return inputs?.filter(
    (input) =>
      "owner" in input &&
      input.owner.toLowerCase() === userAddress.toLowerCase()
  );
};

export const getOutputsSentToUser = (
  transaction: TransactionResult,
  userAddress: string
) => {
  if (!transaction) return [];

  const outputs = transaction.transaction.outputs as TransactionOutput[];

  return outputs?.filter(
    (output) =>
      output.to?.toLowerCase() === userAddress.toLowerCase() ||
      output.owner?.toLowerCase() === userAddress.toLowerCase()
  );
};

export const getRelevantInputsAndOutputs = (
  transaction: TransactionResult,
  userAddress: string
) => {
  const inputs = getInputsSentByUser(transaction, userAddress);
  const outputs = getOutputsSentToUser(transaction, userAddress);

  return {
    inputs,
    outputs,
  };
};

type AssetIdToAsset = {
  [key: string]: Asset;
};

type Asset = {
  assetId: string;
  amountIn: BN;
  amountOut: BN;
};

export const findNetAssetDelta = (
  inputs: TransactionInput[],
  outputs: TransactionOutput[]
) => {
  const assets: AssetIdToAsset = {};

  inputs.forEach((input) => {
    const assetId = input.assetId;
    const amount = input.amount;

    const asset = assets[assetId];

    if (asset) {
      asset.amountIn = bn(asset.amountIn).add(amount);
    } else {
      const newAsset: Asset = {
        assetId,
        amountIn: amount,
        amountOut: bn(0),
      };

      assets[assetId] = newAsset;
    }
  });

  outputs.forEach((output) => {
    const assetId = output.assetId;
    const amount = output.amount;

    const asset = assets[assetId];

    if (asset) {
      asset.amountOut = bn(asset.amountOut).add(amount);
    } else {
      const newAsset: Asset = {
        assetId,
        amountIn: bn(0),
        amountOut: amount,
      };

      assets[assetId] = newAsset;
    }
  });

  return assets;
};

export const isNetNegative = (amountIn: BN, amountOut: BN) => {
  return amountIn.gt(amountOut);
};

export const getUserAddressesFromTransaction = (
  transaction: TransactionResult
) => {
  const addresses: Set<string> = new Set();

  if (!transaction) return [];

  const inputs = transaction.transaction.inputs as TransactionInput[];
  const outputs = transaction.transaction.outputs as TransactionOutput[];

  if (inputs) {
    inputs.forEach((input) => {
      if ("owner" in input) {
        addresses.add(input.owner);
      }
    });
  }

  if (outputs) {
    outputs.forEach((output) => {
      if (output.to) {
        addresses.add(output.to);
      }
      if (output.owner) {
        addresses.add(output.owner);
      }
    });
  }

  return addresses;
};

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const isTransactionTransfer = (transaction: TransactionResult) => {
  // determine if the transaction is a transfer if two accounts are involved, and one account is sending and the other is receiving
  const inputs = transaction.transaction.inputs as TransactionInput[];
  const outputs = transaction.transaction.outputs as TransactionOutput[];

  const inputAddresses = new Set(inputs.map((input) => input.owner));
  const outputAddresses = new Set(
    outputs.map((output) => output.to || output.owner)
  );

  console.log({
    inputAddresses,
    outputAddresses,
  });

  return inputAddresses.size === 1 && outputAddresses.size === 2;
};

export const determineSenderAndReceiver = (transaction: TransactionResult) => {
  const inputs = transaction.transaction.inputs as TransactionInput[];
  const outputs = transaction.transaction.outputs as TransactionOutput[];

  const inputAddresses = new Set(inputs.map((input) => input.owner));
  const outputAddresses = new Set(
    outputs.map((output) => output.to || output.owner)
  );

  return {
    sender: inputAddresses.values().next().value,
    receiver: outputAddresses.values().next().value,
  };
};

export const getTransferredAsset = (transaction: TransactionResult) => {
  // look at the biggest output and return that output
  const outputs = transaction.transaction.outputs as TransactionOutput[];
  const biggestOutput = outputs.reduce((max, output) => {
    return max.amount.gt(output.amount) ? max : output;
  });

  return biggestOutput;
};

export const getRandomSmileyEmoji = () => {
  const emojis = [
    "😈",
    "🤓",
    "🙃",
    "😊",
    "😎",
    "🥳",
    "😇",
    "🤪",
    "😋",
    "🤗",
    "😏",
    "😌",
    "🥰",
    "😜",
    "😝",
    "🤠",
    "🤡",
    "😅",
    "😄",
    "😁",
  ];
  return emojis[Math.floor(Math.random() * emojis.length)];
};
