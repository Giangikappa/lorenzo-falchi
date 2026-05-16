"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  { value: "PENDING_PAYMENT", label: "In attesa pagamento" },
  { value: "PAID", label: "Pagato" },
  { value: "CONFIRMED", label: "Confermato" },
  { value: "SHIPPED", label: "Spedito" },
  { value: "DELIVERED", label: "Consegnato" },
  { value: "CANCELLED", label: "Annullato" },
];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string) => {
    setValue(newStatus);
    setLoading(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className="text-xs border border-stone-200 bg-white px-2 py-1.5 outline-none focus:border-stone-900 transition-colors disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
