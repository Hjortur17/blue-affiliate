"use client";

import { ChevronDown, Info } from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import Banner from "@/components/Banner";
import { IconComponent } from "@/components/Icon";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heading1 } from "@/components/ui/typography";
import { ApiClientError, api } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";
import type { PayoutStatus, PayoutsData } from "@/types/api";

const MIN_PAYOUT = 50_000;

type CommissionMonthStatus = "confirmed" | "pending";

type IndividualRental = {
  id: string;
  startDate: string;
  endDate: string;
  carModel: string;
  revenue: number;
  ratePercent: number;
  commission: number;
};

type CommissionMonth = {
  id: string;
  month: string;
  status: CommissionMonthStatus;
  deliveriesClosed: number;
  deliveriesTotal: number;
  commission: number;
  rentals?: IndividualRental[];
};

// FAKE DATA — the Blue Desk API doesn't yet expose per-month commission breakdowns
// or individual rentals. Remove once docs/api-gaps.md items land.
const sampleCommissionMonths: CommissionMonth[] = [
  {
    id: "2026-04",
    month: "April 2026",
    status: "pending",
    deliveriesClosed: 12,
    deliveriesTotal: 45,
    commission: 18500,
  },
  {
    id: "2026-03",
    month: "March 2026",
    status: "pending",
    deliveriesClosed: 38,
    deliveriesTotal: 52,
    commission: 21200,
  },
  {
    id: "2026-02",
    month: "February 2026",
    status: "confirmed",
    deliveriesClosed: 48,
    deliveriesTotal: 48,
    commission: 19800,
    rentals: [
      { id: "R-2026-0245", startDate: "Feb 1", endDate: "Feb 5", carModel: "Toyota RAV4", revenue: 89500, ratePercent: 5, commission: 4475 },
      { id: "R-2026-0247", startDate: "Feb 2", endDate: "Feb 8", carModel: "Suzuki Jimny", revenue: 76200, ratePercent: 5, commission: 3810 },
      { id: "R-2026-0251", startDate: "Feb 3", endDate: "Feb 7", carModel: "Kia Sportage", revenue: 67800, ratePercent: 5, commission: 3390 },
      { id: "R-2026-0253", startDate: "Feb 5", endDate: "Feb 12", carModel: "Dacia Duster", revenue: 52100, ratePercent: 5, commission: 2605 },
      { id: "R-2026-0258", startDate: "Feb 6", endDate: "Feb 10", carModel: "Hyundai Tucson", revenue: 71300, ratePercent: 5, commission: 3565 },
      { id: "R-2026-0262", startDate: "Feb 8", endDate: "Feb 14", carModel: "Toyota RAV4", revenue: 35900, ratePercent: 5, commission: 1955 },
    ],
  },
  {
    id: "2026-01",
    month: "January 2026",
    status: "confirmed",
    deliveriesClosed: 56,
    deliveriesTotal: 56,
    commission: 22650,
    rentals: [
      { id: "R-2026-0112", startDate: "Jan 2", endDate: "Jan 7", carModel: "Toyota RAV4", revenue: 82400, ratePercent: 5, commission: 4120 },
      { id: "R-2026-0124", startDate: "Jan 4", endDate: "Jan 11", carModel: "Volkswagen Golf", revenue: 68900, ratePercent: 5, commission: 3445 },
      { id: "R-2026-0136", startDate: "Jan 8", endDate: "Jan 15", carModel: "Kia Sportage", revenue: 91300, ratePercent: 5, commission: 4565 },
      { id: "R-2026-0148", startDate: "Jan 12", endDate: "Jan 19", carModel: "Suzuki Vitara", revenue: 73200, ratePercent: 5, commission: 3660 },
      { id: "R-2026-0159", startDate: "Jan 17", endDate: "Jan 22", carModel: "Dacia Duster", revenue: 55800, ratePercent: 5, commission: 2790 },
      { id: "R-2026-0172", startDate: "Jan 22", endDate: "Jan 28", carModel: "Hyundai Tucson", revenue: 81400, ratePercent: 5, commission: 4070 },
    ],
  },
  {
    id: "2025-12",
    month: "December 2025",
    status: "confirmed",
    deliveriesClosed: 68,
    deliveriesTotal: 68,
    commission: 28400,
    rentals: [
      { id: "R-2025-1208", startDate: "Dec 1", endDate: "Dec 8", carModel: "Toyota Land Cruiser", revenue: 128500, ratePercent: 5, commission: 6425 },
      { id: "R-2025-1219", startDate: "Dec 4", endDate: "Dec 10", carModel: "Volkswagen Tiguan", revenue: 87300, ratePercent: 5, commission: 4365 },
      { id: "R-2025-1227", startDate: "Dec 9", endDate: "Dec 15", carModel: "Kia Sportage", revenue: 74600, ratePercent: 5, commission: 3730 },
      { id: "R-2025-1235", startDate: "Dec 14", endDate: "Dec 21", carModel: "Hyundai Tucson", revenue: 92100, ratePercent: 5, commission: 4605 },
      { id: "R-2025-1243", startDate: "Dec 20", endDate: "Dec 27", carModel: "Suzuki Vitara", revenue: 81800, ratePercent: 5, commission: 4090 },
      { id: "R-2025-1258", startDate: "Dec 26", endDate: "Dec 31", carModel: "Toyota RAV4", revenue: 103700, ratePercent: 5, commission: 5185 },
    ],
  },
  {
    id: "2025-11",
    month: "November 2025",
    status: "confirmed",
    deliveriesClosed: 61,
    deliveriesTotal: 61,
    commission: 24750,
    rentals: [
      { id: "R-2025-1104", startDate: "Nov 2", endDate: "Nov 6", carModel: "Volkswagen Golf", revenue: 64200, ratePercent: 5, commission: 3210 },
      { id: "R-2025-1117", startDate: "Nov 5", endDate: "Nov 12", carModel: "Dacia Duster", revenue: 58900, ratePercent: 5, commission: 2945 },
      { id: "R-2025-1125", startDate: "Nov 9", endDate: "Nov 15", carModel: "Toyota RAV4", revenue: 88600, ratePercent: 5, commission: 4430 },
      { id: "R-2025-1134", startDate: "Nov 14", endDate: "Nov 20", carModel: "Kia Sportage", revenue: 79100, ratePercent: 5, commission: 3955 },
      { id: "R-2025-1146", startDate: "Nov 18", endDate: "Nov 24", carModel: "Suzuki Jimny", revenue: 62800, ratePercent: 5, commission: 3140 },
      { id: "R-2025-1163", startDate: "Nov 23", endDate: "Nov 30", carModel: "Hyundai Tucson", revenue: 141400, ratePercent: 5, commission: 7070 },
    ],
  },
];

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

  async function handleSubmitSelected(totalAmount: number): Promise<boolean> {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await api.requestPayout(totalAmount);
      await fetchData();
      return true;
    } catch (err) {
      if (err instanceof ApiClientError) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Failed to submit payout request");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoading && error) {
    return (
      <Banner level="error" message={error} items={["Please try again or contact support if the issue persists."]} />
    );
  }

  return (
    <div>
      <section>
        <div className="space-y-2">
          <Heading1 className="text-2xl">Request Payout</Heading1>
          <p className="text-muted-foreground">
            Select confirmed commission months to request payout. Only months with all deliveries returned and closed
            are available for payout.
          </p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2 rounded-lg bg-linear-to-b md:bg-linear-to-r from-secondary to-[#f54900] p-8">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-[#00ff00]" aria-hidden />
            <span className="text-secondary-muted">Available for Payout</span>
          </div>
          {isLoading ? (
            <div className="animate-pulse h-6 w-40 bg-white/20 rounded" />
          ) : (
            <p className="text-white">{data ? formatPrice(data.availableBalance) : "-"}</p>
          )}
          <p className="text-secondary-muted text-sm">
            {data?.confirmedMonths ?? 0} confirmed months • Minimum payout: {formatPrice(MIN_PAYOUT)}
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border-2 border-[#ff9800] bg-card p-8">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-[#ff9800]" aria-hidden />
            <span className="text-muted-foreground">Pending Confirmation</span>
          </div>
          {isLoading ? (
            <div className="animate-pulse h-6 w-40 bg-muted rounded" />
          ) : (
            <p>{data?.pendingAmount != null ? formatPrice(data.pendingAmount) : "-"}</p>
          )}
          <p className="text-muted-foreground text-sm">Awaiting all deliveries to be returned and closed</p>
        </div>
      </section>

      <SelectCommissionMonths
        months={sampleCommissionMonths}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleSubmitSelected}
        className="mt-8"
      />

      <section className="mt-8">
        <div className="flex flex-col gap-6 rounded-lg border border-[#e5e7eb] bg-card p-6">
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
            <div className="overflow-x-auto">
              <table className="w-full min-w-max whitespace-nowrap">
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
                            className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm", style.bg)}
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
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3 rounded-lg border border-[#bedbff] bg-linear-to-br from-[#eff6ff] to-[#dbeafe] p-6 text-[#1c398e]">
          <div className="flex items-center gap-2">
            <Info className="size-5" />
            <p className="font-bold">Bank Account</p>
          </div>
          <p className="text-sm">
            You can view and update your registered bank account details in the sidebar. Make sure your payment
            information is accurate before requesting a payout.
          </p>
          <p className="text-sm font-medium text-primary">{'← See "Bank Account" in sidebar'}</p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-[#e5e7eb] bg-card p-6">
          <p className="text-card-foreground">Need Help?</p>
          <p className="text-sm text-muted-foreground">
            If you have questions about your payout, commission calculations, or need assistance with your account,
            please contact our support team.
          </p>
          <a href="mailto:affiliates@bluecarrental.is" className="text-sm text-secondary">
            Contact Support →
          </a>
        </div>
      </section>
    </div>
  );
}

function SelectCommissionMonths({
  months,
  isSubmitting,
  submitError,
  onSubmit,
  className,
}: {
  months: CommissionMonth[];
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (totalAmount: number) => Promise<boolean>;
  className?: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const selectedMonths = months.filter((m) => selected.has(m.id));
  const selectedTotal = selectedMonths.reduce((sum, m) => sum + m.commission, 0);

  const toggle = (m: CommissionMonth) => {
    if (m.status !== "confirmed") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(m.id)) next.delete(m.id);
      else next.add(m.id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openConfirm = () => {
    if (selected.size === 0 || selectedTotal < MIN_PAYOUT) return;
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    const success = await onSubmit(selectedTotal);
    if (success) {
      setSelected(new Set());
      setIsConfirmOpen(false);
    }
  };

  const canSubmit = selected.size > 0 && selectedTotal >= MIN_PAYOUT && !isSubmitting;
  const buttonLabel =
    selected.size === 0
      ? "Select Months to Continue"
      : selectedTotal < MIN_PAYOUT
        ? `Minimum payout: ${formatPrice(MIN_PAYOUT)}`
        : isSubmitting
          ? "Submitting..."
          : `Request payout of ${formatPrice(selectedTotal)}`;

  return (
    <section className={cn("rounded-lg border border-[#e5e7eb] bg-card p-6", className)}>
      <h2 className="text-card-foreground">Select Commission Months</h2>

      <div className="mt-3 pb-4 border-b border-light-gray flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-[#364153]">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#00ff00]" aria-hidden />
          Confirmed — All deliveries closed
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#ff9800]" aria-hidden />
          Pending — Deliveries still ongoing
        </span>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-max text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-light-gray text-[#4a5565] font-bold">
              <th className="w-10 py-3" />
              <th className="text-left py-3 pr-4 w-16">Select</th>
              <th className="text-left py-3 pr-4">Month</th>
              <th className="text-left py-3 pr-4">Status</th>
              <th className="text-right py-3 pr-4">Deliveries</th>
              <th className="text-right py-3 pl-4">Commission</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => {
              const isConfirmed = m.status === "confirmed";
              const isSelected = selected.has(m.id);
              const isExpanded = expanded.has(m.id);
              return (
                <Fragment key={m.id}>
                  <tr className={cn("border-b border-[#f3f4f6]", !isConfirmed && "opacity-60")}>
                    <td className="py-4 pl-2 pr-2 w-10">
                      {isConfirmed && (
                        <button
                          type="button"
                          aria-label={isExpanded ? `Collapse ${m.month}` : `Expand ${m.month}`}
                          aria-expanded={isExpanded}
                          onClick={() => toggleExpand(m.id)}
                          className="flex items-center justify-center size-6 rounded text-muted-foreground hover:bg-muted"
                        >
                          <ChevronDown
                            className={cn("size-4 transition-transform", isExpanded && "rotate-180")}
                          />
                        </button>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <Checkbox
                        aria-label={`Select ${m.month}`}
                        disabled={!isConfirmed}
                        checked={isSelected}
                        onCheckedChange={() => toggle(m)}
                      />
                    </td>
                    <td className="py-4 pr-4 text-card-foreground">{m.month}</td>
                    <td className="py-4 pr-4 text-[#364153] capitalize">
                      <span className="flex items-center gap-2">
                        <span
                          className={cn("size-2 rounded-full", isConfirmed ? "bg-[#00ff00]" : "bg-[#ff9800]")}
                          aria-hidden
                        />
                        {m.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right text-card-foreground">
                      {m.deliveriesClosed}/{m.deliveriesTotal}
                    </td>
                    <td className="py-4 pl-4 text-right font-medium text-card-foreground">
                      {formatPrice(m.commission)}
                    </td>
                  </tr>
                  {isConfirmed && m.rentals && (
                    <tr className={cn(isExpanded && "border-b border-[#f3f4f6]")}>
                      <td colSpan={6} className="bg-[#f9fafb] p-0">
                        <div
                          className={cn(
                            "grid transition-[grid-template-rows] duration-300 ease-in-out",
                            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                          )}
                        >
                          <div className="overflow-hidden">
                            <div className="px-8 py-5">
                              <IndividualRentalsTable
                                month={m.month}
                                totalCommission={m.commission}
                                rentals={m.rentals}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {submitError && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {submitError}
        </div>
      )}

      <div className="mt-5">
        <Banner
          level="info"
          message="Important Information:"
          items={[
            "Only confirmed months with all deliveries closed can be selected",
            "Payout requests are processed twice per month (1st and 15th)",
            "All amounts are exclusive of VAT",
            "Funds will be transferred to your registered bank account",
          ]}
        />
      </div>

      <button
        type="button"
        onClick={openConfirm}
        disabled={!canSubmit}
        className={cn(
          "mt-5 w-full h-12 rounded-lg bg-secondary text-white transition-opacity",
          !canSubmit && "opacity-50 cursor-not-allowed",
        )}
      >
        {buttonLabel}
      </button>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm payout request</DialogTitle>
            <DialogDescription>
              You're about to request a payout for the following commission months. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb]">
            <ul className="divide-y divide-[#f3f4f6]">
              {selectedMonths.map((m) => (
                <li key={m.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-card-foreground">{m.month}</span>
                  <span className="font-medium text-card-foreground">{formatPrice(m.commission)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t-2 border-[#ffd966] bg-[#fffbf0] px-4 py-3">
              <span className="text-sm font-bold text-foreground">Total</span>
              <span className="text-base font-bold text-secondary">{formatPrice(selectedTotal)}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Funds will be transferred to your registered bank account. Payouts are processed twice per month (1st and
            15th).
          </p>

          <DialogFooter className="mt-2">
            <button
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-lg bg-[#f3f4f6] text-[#364153] text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-lg bg-secondary text-white text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : `Confirm & request ${formatPrice(selectedTotal)}`}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function IndividualRentalsTable({
  month,
  totalCommission,
  rentals,
}: {
  month: string;
  totalCommission: number;
  rentals: IndividualRental[];
}) {
  return (
    <div className="whitespace-normal">
      <p className="text-sm font-bold text-foreground">Individual Rentals — {month}</p>
      <p className="mt-1 text-xs text-muted-foreground">{rentals.length} completed rentals</p>

      <div className="mt-3 overflow-hidden rounded-lg border border-[#E5E7EB] bg-card">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-light-gray bg-[#f3f4f6] text-[#4a5565] font-bold">
              <th className="text-left px-3 py-2.5">Rental ID</th>
              <th className="text-left px-3 py-2.5">Rental Dates</th>
              <th className="text-left px-3 py-2.5">Car Model</th>
              <th className="text-right px-3 py-2.5">Rental Revenue</th>
              <th className="text-right px-3 py-2.5 w-14">Rate</th>
              <th className="text-right px-3 py-2.5">Commission</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((r) => (
              <tr key={r.id} className="border-b border-[#f3f4f6] last:border-b-0">
                <td className="px-3 py-2.5 text-card-foreground">{r.id}</td>
                <td className="px-3 py-2.5 text-card-foreground">
                  {r.startDate} → {r.endDate}
                </td>
                <td className="px-3 py-2.5 text-card-foreground">{r.carModel}</td>
                <td className="px-3 py-2.5 text-right text-card-foreground">{formatPrice(r.revenue)}</td>
                <td className="px-3 py-2.5 text-right text-muted-foreground">{r.ratePercent}%</td>
                <td className="px-3 py-2.5 text-right font-medium text-secondary">{formatPrice(r.commission)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#ffd966] bg-[#fffbf0]">
              <td colSpan={4} />
              <td className="px-3 py-3 text-right text-xs font-bold text-foreground whitespace-nowrap">
                Total for {month}:
              </td>
              <td className="px-3 py-3 text-right text-sm font-bold text-secondary">{formatPrice(totalCommission)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
