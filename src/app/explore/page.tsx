"use client";
import { Button, Input, Modal, Placeholder } from "@telegram-apps/telegram-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Explore() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  return (
    <Modal
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          setSearch("");
          router.push("/profile");
        }
      }}
    >
      <Input
        placeholder="Paste address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-8"
      />
      <Button
        onClick={() => {
          router.push(`/creators/${search}`);
        }}
        className="mx-auto mb-24 mt-8 flex"
      >
        Search
      </Button>
    </Modal>
  );
}
