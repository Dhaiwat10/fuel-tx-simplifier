import { redirect } from "next/navigation";
import { isTransactionTransfer } from "./utils";
import { getTransactionSummary, Provider } from "fuels";
import TransactionDetails from "@/components/tx-details";
import { Separator } from "@/components/ui/separator";

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

  const transaction = await getTransactionSummary({
    id: transactionId,
    provider,
  });

  const isTransfer = isTransactionTransfer(transaction);

  console.log({
    isTransfer,
  });

  return (
    <div className="flex flex-col">
      <TransactionDetails transaction={transaction} />

      <Separator />

      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">Accounts</h1>
      </div>
    </div>
  );
}
