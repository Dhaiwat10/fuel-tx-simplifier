/* eslint-disable @next/next/no-img-element */
import { findFuelAssetById, getVerifiedAssets } from "@/app/assets";
import {
  findNetAssetDelta,
  getRelevantInputsAndOutputs,
  isNetNegative,
} from "@/app/utils";
import { Provider } from "fuels";
import { Card } from "./ui/card";

export const NewAccountSummary = async ({
  transactionId,
  accountAddress,
}: {
  transactionId: string;
  accountAddress: string;
}) => {
  const provider = await Provider.create(
    "https://mainnet.fuel.network/v1/graphql"
  );

  const transaction = await provider.getTransaction(transactionId);

  const { inputs, outputs } = getRelevantInputsAndOutputs(
    transaction,
    accountAddress
  );

  const allAssets = await getVerifiedAssets();

  const assets = findNetAssetDelta(inputs || [], outputs || []);

  return (
    <Card
      key={accountAddress}
      className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6">
        {/* Account Header */}
        <div className="mb-6">
          <div className="font-mono text-lg text-white">{accountAddress}</div>
        </div>

        {/* Assets List */}
        <div className="space-y-6">
          {Object.entries(assets).map(([assetId, asset], index) => {
            const fuelAsset = findFuelAssetById(allAssets, assetId);

            if (!fuelAsset) return null;

            const icon = fuelAsset.icon;
            return (
              <div
                key={fuelAsset.assetId}
                className={`flex flex-col space-y-2 ${
                  index !== Object.entries(assets).length - 1
                    ? "pb-6 border-b border-zinc-800/50"
                    : ""
                }`}
              >
                {/* Asset Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full"bg-[#00FFA3]/10" flex items-center justify-center`}
                    >
                      <img
                        src={icon}
                        alt={fuelAsset.name}
                        className="w-6 h-6"
                      />
                    </div>
                    <span className="font-medium text-white">
                      {fuelAsset.name}
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-bold tracking-tight ${
                      !isNetNegative(asset.amountIn, asset.amountOut)
                        ? "text-[#00FFA3]"
                        : "text-red-400"
                    }`}
                  >
                    {isNetNegative(asset.amountIn, asset.amountOut) ? "-" : "+"}
                    {parseFloat(
                      asset.amountIn
                        .sub(asset.amountOut)
                        .formatUnits(fuelAsset.decimals)
                    ).toFixed(5)}
                  </div>
                </div>

                {/* Asset Details */}
                <div className="grid grid-cols-2 gap-4 pl-[52px]">
                  <div>
                    <div className="text-sm text-zinc-400 mb-1">Spent</div>
                    <div className="font-mono text-white">
                      {parseFloat(
                        asset.amountIn.formatUnits(fuelAsset.decimals)
                      ).toFixed(5)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400 mb-1">Received</div>
                    <div className="font-mono text-white">
                      {parseFloat(
                        asset.amountOut.formatUnits(fuelAsset.decimals)
                      ).toFixed(5)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
