import assetsJson from "../assets.json";

interface FuelAsset {
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  assetId: string;
}

type ApiResponse = FuelAsset[];

export const getVerifiedAssets = async (): Promise<ApiResponse> => {
  return await (
    await fetch("https://verified-assets.fuel.network/assets.json")
  ).json();
};

/**
 * Finds an asset on Fuel mainnet by its asset ID
 * @param assetId - The Fuel asset ID to search for
 * @returns The matching asset with its decimals or undefined if not found
 */
export function findFuelAssetById(assets: typeof assetsJson, assetId: string): FuelAsset | undefined {
  const asset = assets.find((asset) =>
    asset.networks.some(
      (network) =>
        network.type === "fuel" &&
        network.chain === "mainnet" &&
        network.assetId === assetId
    )
  );

  if (!asset) return undefined;

  const fuelNetwork = asset.networks.find(
    (network) => network.type === "fuel" && network.chain === "mainnet"
  );

  if (!fuelNetwork?.assetId) return undefined;

  return {
    name: asset.name,
    symbol: asset.symbol,
    icon: asset.icon,
    decimals: fuelNetwork.decimals,
    assetId: fuelNetwork.assetId,
  };
}

/**
 * Gets all assets available on Fuel mainnet
 * @returns Array of assets that are available on Fuel mainnet with their decimals
 */
export function getFuelMainnetAssets(assets: typeof assetsJson): FuelAsset[] {
  return assets
    .filter((asset) =>
      asset.networks.some(
        (network) => network.type === "fuel" && network.chain === "mainnet"
      )
    )
    .map((asset) => {
      const fuelNetwork = asset.networks.find(
        (network) => network.type === "fuel" && network.chain === "mainnet"
      )!;

      return {
        name: asset.name,
        symbol: asset.symbol,
        icon: asset.icon,
        decimals: fuelNetwork.decimals,
        assetId: fuelNetwork.assetId,
      };
    });
}
