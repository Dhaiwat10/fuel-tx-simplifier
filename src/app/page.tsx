import { redirect } from "next/navigation";
import { getUserAddressesFromTransaction } from "./utils";
import { Provider } from "fuels";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewAccountSummary } from "@/components/NewAccountSummary";
import { Fuel } from "lucide-react";

export default async function Home({
  searchParams,
}: {
  searchParams: { tx?: string };
}) {
  if (!searchParams.tx) {
    redirect(
      "/?tx=0x2260848fb5f34f85f46710dc2afda9b40571552faa02154f93542ba7fc5a3812"
    );
  }

  const transactionId = searchParams.tx;

  const provider = await Provider.create(
    "https://mainnet.fuel.network/v1/graphql"
  );

  const transaction = await provider.getTransaction(transactionId);

  const accountsInvolved = Array.from(
    getUserAddressesFromTransaction(transaction)
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-900 to-black">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(0,255,163,0.03)_1px,transparent_1px),linear-gradient(to_bottom_left,rgba(0,255,163,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{
            maskImage:
              "radial-gradient(circle at center, black, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black, transparent 80%)",
          }}
        />
      </div>

      <div className="relative">
        {/* Header Section */}
        <header className="border-b border-zinc-800/50 backdrop-blur-xl bg-black/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center">
                <Fuel className="w-6 h-6 text-[#00FFA3]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Fuel Simplified Transaction Summary
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Search Section */}
          <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl p-6 mb-12">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-white mb-2">
                  Asset Delta Explorer
                </h2>
                <p className="text-sm text-zinc-400">
                  Enter a transaction ID to see the asset changes for each
                  account involved.
                </p>
              </div>

              <div className="flex gap-4">
                <Input
                  className="flex-1 bg-black/30 border-zinc-800 text-sm font-mono h-12 text-white"
                  placeholder="0x2260848fb5f34f85f46710dc2afda9b40571552faa02154f93542ba7fc5a3812"
                  spellCheck={false}
                />
                <Button className="bg-[#00FFA3] text-black hover:bg-[#00FFA3]/90 px-8 h-12 font-medium">
                  Search
                </Button>
              </div>
            </div>
          </Card>

          <span className="text-sm text-zinc-400 flex items-center gap-2">
            Transaction ID:{" "}
            <a
              href={`https://app.fuel.network/tx/${transactionId}/simple`}
              target="_blank"
              className="text-[#00FFA3] hover:underline"
            >
              {transactionId}
            </a>
          </span>

          {/* Account Summaries */}
          <div className="space-y-6 mt-4">
            {accountsInvolved.map((account) => (
              <NewAccountSummary
                key={account}
                transactionId={transactionId}
                accountAddress={account}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
