"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function SearchBar({ initialTxId }: { initialTxId: string }) {
  const [txId, setTxId] = useState(initialTxId);
  const router = useRouter();

  const handleSearch = () => {
    router.push(`/?tx=${txId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Input
        className="flex-1 bg-black/30 border-zinc-800 text-sm font-mono h-12 text-white"
        placeholder="0x2260848fb5f34f85f46710dc2afda9b40571552faa02154f93542ba7fc5a3812"
        spellCheck={false}
        value={txId}
        onChange={(e) => setTxId(e.target.value)}
      />
      <Button className="bg-[#00FFA3] text-black hover:bg-[#00FFA3]/90 px-8 h-12 font-medium">
        Search
      </Button>
    </form>
  );
}
