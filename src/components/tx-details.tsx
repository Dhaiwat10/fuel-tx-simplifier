/* eslint-disable @next/next/no-img-element */
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Copy } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { format, TransactionResult, DateTime } from "fuels";
import {
  determineSenderAndReceiver,
  getRandomSmileyEmoji,
  getTransferredAsset,
  truncateAddress,
} from "@/app/utils";
import { findFuelAssetById, getVerifiedAssets } from "@/app/assets";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "./ui/separator";
import Link from "next/link";

const demoTransactions = [
  "0x2260848fb5f34f85f46710dc2afda9b40571552faa02154f93542ba7fc5a3812",
  "0x34fdea2738ee289f393b30a5885c2278f103c30aa536f4409bb601c27c9fd8b3",
  "0x0f5135c9075e1f9a681fbcb2680a9b639b922fc21046dc29f4b9a2ecc9fc3010",
  "0x2260848fb5f34f85f46710dc2afda9b40571552faa02154f93542ba7fc5a3812",
];

export default async function TransactionDetails({
  transaction,
}: {
  transaction: TransactionResult;
}) {
  const txId = transaction.id;

  console.log({
    transaction,
  });

  const { sender, receiver } = determineSenderAndReceiver(transaction);

  const { assetId, amount } = getTransferredAsset(transaction);

  const allAssets = await getVerifiedAssets();

  const fuelAsset = findFuelAssetById(allAssets, assetId);

  const emoji1 = getRandomSmileyEmoji();

  // make sure emoji2 is different from emoji1
  let emoji2 = getRandomSmileyEmoji();
  while (emoji2 === emoji1) {
    emoji2 = getRandomSmileyEmoji();
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Transaction ID Input */}
        {/* <div className="mb-8 flex gap-2">
          <Input
            type="text"
            placeholder="Enter transaction ID"
            value={inputTxId}
            onChange={(e) => setInputTxId(e.target.value)}
            className="flex-grow bg-zinc-900/40 border-zinc-800/50 text-white placeholder-zinc-500"
          />
          <Button
            onClick={handleSearch}
            className="bg-[#00FFA3] text-black hover:bg-[#00FFA3]/90"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div> */}

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Transaction Details</h1>
          <Tabs value="everyday" className="pointer-events-none mt-4 md:mt-0">
            <TabsList className="bg-zinc-800/50">
              <TabsTrigger
                value="everyday"
                className="data-[state=active]:bg-[#00FFA3] data-[state=active]:text-black"
              >
                Everyday
              </TabsTrigger>
              <TabsTrigger value="simple" className="opacity-50">
                Simple
              </TabsTrigger>
              <TabsTrigger value="advanced" className="opacity-50">
                Advanced
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Transaction Status Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full">
            <ArrowRight className="w-4 h-4" />
            <span>Transfer</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4" />
            <span>Success</span>
          </div>
          <div className="text-sm text-zinc-400">
            {formatDistanceToNow(
              DateTime.fromTai64(transaction.time as string),
              {
                addSuffix: true,
              }
            )}{" "}
            <span className="text-zinc-500">
              {DateTime.fromTai64(transaction.time as string).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-zinc-900/40 rounded-lg border border-zinc-800/50 p-6">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-5 top-12 bottom-4 w-px bg-zinc-800" />

            {/* From Address */}
            <div className="flex items-center gap-4 mb-6 relative">
              <Avatar className="w-10 h-10 rounded-full border-2 border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-2xl">
                <span role="img" aria-label="Random smiley">
                  {emoji1}
                </span>
              </Avatar>
              <code className="text-white font-mono underline decoration-zinc-500 decoration-dotted underline-offset-4 cursor-pointer hover:text-blue-400 transition-colors">
                {truncateAddress(sender)}
              </code>
              <Button variant="ghost" size="icon" className="h-4 w-4">
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            {/* Transfer Amount */}
            <div className="ml-[52px] mb-6">
              <div className="flex items-baseline gap-2">
                <ArrowRight className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400">Transfer</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">
                    {format(amount, {
                      precision: 4,
                      units: fuelAsset?.decimals,
                    })}
                  </span>
                  <button className="text-lg font-medium underline decoration-zinc-500 decoration-dotted underline-offset-4 cursor-pointer hover:text-blue-400 transition-colors">
                    {fuelAsset?.symbol}
                  </button>
                  <img
                    src={fuelAsset?.icon}
                    alt={fuelAsset?.name}
                    className="w-6 h-6"
                  />
                  <span className="hidden md:block text-sm text-zinc-400">$294.54</span>
                </div>
              </div>
            </div>

            {/* To Address */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-10 h-10 rounded-full border-2 border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-2xl">
                <span role="img" aria-label="Random smiley">
                  {emoji2}
                </span>
              </Avatar>
              <span className="text-sm text-zinc-400">to</span>
              <code className="text-white font-mono underline decoration-zinc-500 decoration-dotted underline-offset-4 cursor-pointer hover:text-blue-400 transition-colors">
                {truncateAddress(receiver)}
              </code>
              <Button variant="ghost" size="icon" className="h-4 w-4">
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            {/* Fee */}
            <div className="ml-[52px] mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-zinc-400">Fee</span>
                <span className="font-mono">
                  {format(transaction.fee, {
                    precision: 4,
                    units: 18,
                  })}{" "}
                  <span className="underline decoration-zinc-500 decoration-dotted underline-offset-4 cursor-pointer hover:text-blue-400 transition-colors">
                    ETH
                  </span>
                </span>
                <span className="text-sm text-zinc-400">$0.00004</span>
              </div>
            </div>

            {/* Block */}
            <div className="ml-[52px]">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-zinc-400">Block</span>
                <span className="font-mono underline decoration-zinc-500 decoration-dotted underline-offset-4 cursor-pointer hover:text-blue-400 transition-colors">
                  {truncateAddress(transaction.blockId as string)}
                </span>
                <span className="text-sm text-zinc-400">
                  48 block confirmations ago
                </span>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="ml-[52px] mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-zinc-400">Transaction ID</span>
                <span className="font-mono text-white break-all">
                  {truncateAddress(txId)}
                </span>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-zinc-600" />

        <div className="flex flex-col">
          <h3 className="text-xl font-semibold">Other demo transactions</h3>

          <div className="flex flex-col gap-4 mt-4">
            {demoTransactions.map((txId, idx) => (
              <div key={idx}>
                <Link
                  href={`/?tx=${txId}`}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-zinc-500 decoration-dotted underline-offset-4"
                >
                  {truncateAddress(txId)}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
