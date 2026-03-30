"use client";

import { Heading1 } from "@/components/ui/typography";
import Banner from "@/components/Banner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Icon, { IconComponent } from "@/components/Icon";

const payoutHistory = [
  { requestDate: "November 1, 2025", amount: "45,800 Kr", status: "Paid", paidDate: "November 15, 2025" },
  { requestDate: "October 1, 2025", amount: "38,200 Kr", status: "Paid", paidDate: "October 14, 2025" },
  { requestDate: "December 1, 2025", amount: "52,100 Kr", status: "Approved", paidDate: "-" },
];

export default function Home() {
  return (
    <>
      <section>
        <div className="space-y-2">
          <Heading1 className="text-2xl">Request Payout</Heading1>
          <p className="text-muted-foreground">
            Request a payout of your earned commissions. Payouts are typically processed within 7-14 business days.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-2 rounded-lg bg-linear-to-b md:bg-linear-to-r from-secondary to-[#F54900] pt-8 px-8 pb-8">
          <div className="flex items-center gap-3">
            <IconComponent icon="DollarSign" className="size-8 text-white" />
            <span className="text-secondary-muted">Available Balance</span>
          </div>
          <p className="text-white text-3xl md:text-2xl">62,250 Kr</p>
          <p className="text-secondary-muted text-sm">Minimum payout: 10,000 Kr</p>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
          <p className="text-card-foreground">New Payout Request</p>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-card-foreground">Payout Amount (Kr)</label>
              <Input
                type="number"
                placeholder="Enter amount (min 10,000 Kr)"
                className="h-12.5 rounded-lg border-light-gray placeholder:text-card-foreground/50"
              />
            </div>

            <Banner
              level="info"
              message="Important Information"
              items={[
                "Payout requests are processed twice per month (1st and 15th)",
                "All amounts are exclusive of VAT",
                "Funds will be transferred to your registered bank account",
                "You'll receive an email confirmation once processed",
              ]}
            />

            <Button variant="secondary" className="w-full h-12 rounded-lg">
              Submit Payout Request
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
          <p className="text-card-foreground">Payout History</p>

          {/* Desktop table */}
          <table className="hidden sm:table w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 pl-4 text-left text-base font-bold text-muted-foreground">Request Date</th>
                <th className="pb-3 pl-4 text-left text-base font-bold text-muted-foreground">Amount</th>
                <th className="pb-3 pl-4 text-left text-base font-bold text-muted-foreground">Status</th>
                <th className="pb-3 pl-4 text-left text-base font-bold text-muted-foreground">Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((row) => (
                <tr key={row.requestDate} className="border-b border-border/40">
                  <td className="py-4 pl-4 text-card-foreground">{row.requestDate}</td>
                  <td className="py-4 pl-4 text-card-foreground">{row.amount}</td>
                  <td className="py-4 pl-4">
                    <span
                      className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm", {
                        "bg-success-bg text-success": row.status === "Paid",
                        "bg-primary/10 text-primary": row.status === "Approved",
                      })}
                    >
                      <IconComponent icon="CircleCheck" className="size-4" />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-muted-foreground">{row.paidDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {payoutHistory.map((row) => (
              <div
                key={row.requestDate}
                className="flex items-start justify-between rounded-lg border border-border p-4"
              >
                <div className="flex flex-col">
                  <p className="font-medium">{row.amount}</p>
                  <p className="text-sm text-muted-foreground">Requested: {row.requestDate}</p>
                  {row.paidDate !== "-" && <p className="text-sm text-muted-foreground">Paid: {row.paidDate}</p>}
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0",
                    {
                      "bg-success-bg text-success": row.status === "Paid",
                      "bg-primary/10 text-primary": row.status === "Approved",
                    },
                  )}
                >
                  {row.status === "Paid" ? <IconComponent icon="CircleCheck" className="size-3" /> : null}
                  {row.status === "Approved" ? <IconComponent icon="Clock" className="size-3" /> : null}
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-4 rounded-lg bg-background p-6">
          <p className="text-lg font-medium text-card-foreground">Need Help?</p>
          <p className="text-muted-foreground">
            If you have questions about your payout or need to update your bank account information, please contact our
            support team.
          </p>
          <Link href="/support" className="text-secondary font-medium">
            Contact Support →
          </Link>
        </div>
      </section>
    </>
  );
}
