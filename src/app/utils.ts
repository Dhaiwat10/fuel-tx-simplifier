import { bn, BN, Input, Output } from "fuels";
import type { Transaction } from "../app/page";

type TransactionInput = Input & {
  assetId: string;
  amount: BN;
};
type TransactionOutput = Output & {
  owner?: string;
  to?: string;
  amount: BN;
  assetId: string;
};

export const getInputsSentByUser = (
  transaction: Transaction,
  userAddress: string
) => {
  if (!transaction) return [];

  const inputs = transaction.inputs as TransactionInput[];

  return inputs?.filter(
    (input) =>
      "owner" in input &&
      input.owner.toLowerCase() === userAddress.toLowerCase()
  );
};

export const getOutputsSentToUser = (
  transaction: Transaction,
  userAddress: string
) => {
  if (!transaction) return [];

  const outputs = transaction.outputs as TransactionOutput[];

  return outputs?.filter(
    (output) =>
      output.to?.toLowerCase() === userAddress.toLowerCase() ||
      output.owner?.toLowerCase() === userAddress.toLowerCase()
  );
};

export const getRelevantInputsAndOutputs = (
  transaction: Transaction,
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

export const findNetAssetDelta = (inputs: TransactionInput[], outputs: TransactionOutput[]) => {
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

export const getUserAddressesFromTransaction = (transaction: Transaction) => {
  const addresses: Set<string> = new Set();

  if (!transaction) return [];

  const inputs = transaction.inputs as TransactionInput[];
  const outputs = transaction.outputs as TransactionOutput[];

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
