"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Heading1 } from "@/components/ui/typography";
import Banner from "@/components/Banner";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconComponent } from "@/components/Icon";
import { api, ApiClientError } from "@/lib/api";
import type { PayoutsData, PayoutStatus } from "@/types/api";

const MIN_PAYOUT = 10_000;

const statusStyles: Record<PayoutStatus, { bg: string; icon: string }> = {
  paid: { bg: "bg-success-bg text-success", icon: "CircleCheck" },
  approved: { bg: "bg-primary/10 text-primary", icon: "Clock" },
  pending: { bg: "bg-yellow-100 text-yellow-700", icon: "Clock" },
  rejected: { bg: "bg-red-100 text-red-700", icon: "XCircle" },
};

const statusLabels: Record<PayoutStatus, string> = {
  paid: "Paid",
  approved: "Approved — Awaiting Payment",
  pending: "Pending",
  rejected: "Rejected",
};

function formatIsoDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function PayoutPage() {
  const [data, setData] = useState<PayoutsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getPayouts();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payout data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const numAmount = Number(amount);
    if (numAmount < MIN_PAYOUT) {
      setSubmitError(`Minimum payout amount is ${formatPrice(MIN_PAYOUT)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.requestPayout(numAmount);
      setAmount("");
      await fetchData();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Failed to submit payout request");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoading && error) {
    return (
      <Banner
        level="error"
        message={error}
        items={["Please try again or contact support if the issue persists."]}
      />
    );
  }

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
          {isLoading ? (
            <div className="animate-pulse h-9 w-40 bg-white/20 rounded" />
          ) : (
            <p className="text-white text-3xl md:text-2xl">{data ? formatPrice(data.availableBalance) : "-"}</p>
          )}
          <p className="text-secondary-muted text-sm">Minimum payout: {formatPrice(MIN_PAYOUT)}</p>
        </div>
      </section>

      <section className="mt-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6"
        >
          <p className="text-card-foreground">New Payout Request</p>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="payout-amount" className="text-card-foreground">
                Payout Amount (Kr)
              </label>
              <Input
                id="payout-amount"
                type="number"
                placeholder={`Enter amount (min ${formatPrice(MIN_PAYOUT)})`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12.5 rounded-lg border-light-gray placeholder:text-card-foreground/50"
              />
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {submitError}
              </div>
            )}

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

            <Button type="submit" disabled={isSubmitting || isLoading} variant="secondary" className="w-full h-12 rounded-lg">
              {isSubmitting ? "Submitting..." : "Submit Payout Request"}
            </Button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
          <p className="text-card-foreground">Payout History</p>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          ) : data && data.history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No payout history yet.</p>
          ) : data ? (
            <>
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
                  {data.history.map((row) => {
                    const style = statusStyles[row.status];
                    return (
                      <tr key={row.id} className="border-b border-border/40">
                        <td className="py-4 pl-4 text-card-foreground">{formatIsoDate(row.requestDate)}</td>
                        <td className="py-4 pl-4 text-card-foreground">{formatPrice(row.amount)}</td>
                        <td className="py-4 pl-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm",
                              style.bg,
                            )}
                          >
                            <IconComponent icon={style.icon} className="size-4" />
                            {statusLabels[row.status]}
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-muted-foreground">
                          {row.paidDate ? formatIsoDate(row.paidDate) : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mobile cards */}
              <div className="flex flex-col gap-3 sm:hidden">
                {data.history.map((row) => {
                  const style = statusStyles[row.status];
                  return (
                    <div
                      key={row.id}
                      className="flex items-start justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex flex-col">
                        <p className="font-medium">{formatPrice(row.amount)}</p>
                        <p className="text-sm text-muted-foreground">Requested: {formatIsoDate(row.requestDate)}</p>
                        {row.paidDate && (
                          <p className="text-sm text-muted-foreground">Paid: {formatIsoDate(row.paidDate)}</p>
                        )}
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0",
                          style.bg,
                        )}
                      >
                        <IconComponent icon={style.icon} className="size-3" />
                        {statusLabels[row.status]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
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
