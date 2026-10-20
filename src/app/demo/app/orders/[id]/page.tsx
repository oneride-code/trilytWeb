"use client";

import { use } from "react";
import { Shell } from "@/components/demo/Shell";
import { BookingCard } from "@/components/demo/BookingCard";
import { Empty } from "@/components/demo/ui";
import { useDemo } from "@/lib/demo/store";

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders } = useDemo();
  const o = orders.find((x) => x.id === id);
  if (!o) return <Shell title="Booking" crumb={{ href: "/demo/app/orders", label: "Bookings" }}><Empty>No booking {id} in the sample data.</Empty></Shell>;
  return (
    <Shell title={o.id} crumb={{ href: "/demo/app/orders", label: "Bookings" }}>
      <div className="mx-auto w-full max-w-[920px]"><BookingCard o={o} /></div>
    </Shell>
  );
}
