"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { IconComponent } from "./Icon";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import CopyButton from "./CopyButton";

const navigation = [
  { name: "Dashboard", href: "/", icon: "Car" },
  { name: "Performance", href: "/performance", icon: "ChartColumn" },
  { name: "Marketing material", href: "/marketing-material", icon: "LongArrowRight" },
  // { name: "Academy", href: "/academy", icon: "GraduationCap" },
  { name: "Request payout", href: "/payout", icon: "DollarSign" },
  { name: "Log-out", href: "#", icon: "LogOut", action: "logout" as const },
];

const accordion = [
  {
    title: "Price",
    content:
      "Price refers to the amount of money a customer pays to acquire a product or service. It not only reflects the value offered but also influences demand, competitiveness, and brand perception. A well-set price balances affordability for customers with profitability for the business.",
  },
  { title: "Invoice", content: "Invoice details and information." },
  { title: "Cancel", content: "Cancellation policies and procedures." },
  { title: "What is status", content: "Understanding booking statuses." },
];

function NavbarRight() {
  return (
    <ul className="flex items-center text-white">
      <li>
        <Link href="/">
          <IconComponent icon="Globe" className="text-white" />
        </Link>
      </li>
      <li className="pl-4">
        <div className="flex items-center gap-2">
          <IconComponent icon="ChevronDown" className="text-white" />
          <span>Kr</span>
        </div>
      </li>
      <li className="pl-8">
        <div className="flex items-center gap-2">
          <IconComponent icon="User" className="text-white" />
          <span className="font-medium hidden lg:inline">Your account</span>
        </div>
      </li>
    </ul>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { affiliate, logout } = useAuth();

  return (
    <>
      {/* Desktop navbar */}
      <nav className="hidden lg:flex justify-between items-center p-4 bg-primary rounded-2xl pl-6 pr-15 py-7">
        <Link href="/">
          <Image src="/logo.svg" alt="Blue Affiliate" width={100} height={100} />
        </Link>
        <NavbarRight />
      </nav>

      {/* Mobile navbar */}
      <nav className="lg:hidden flex justify-between items-center bg-primary -mx-4 -mt-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setOpen(true)}>
            <IconComponent icon="Menu" className="text-white size-6" />
          </button>
          <Link href="/">
            <Image src="/logo.svg" alt="Blue Affiliate" width={75} height={14} />
          </Link>
        </div>
        <NavbarRight />
      </nav>

      {/* Mobile sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" showCloseButton={false} className="data-[side=left]:w-full data-[side=left]:sm:max-w-full border-0 p-0 bg-background">
          <SheetTitle className="sr-only">Navigation</SheetTitle>

          {/* Sheet header — same as mobile navbar */}
          <div className="flex justify-between items-center bg-primary px-4 py-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setOpen(false)}>
                <IconComponent icon="X" className="text-white size-6" />
              </button>
              <Link href="/" onClick={() => setOpen(false)}>
                <Image src="/logo.svg" alt="Blue Affiliate" width={75} height={14} />
              </Link>
            </div>
            <NavbarRight />
          </div>

          {/* Navigation links */}
          <div className="px-5 pt-4 overflow-y-auto flex-1">
            <nav>
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          if (item.action === "logout") {
                            e.preventDefault();
                            setOpen(false);
                            logout();
                          } else {
                            setOpen(false);
                          }
                        }}
                        className={cn(
                          "flex items-center gap-3 h-12 px-4 rounded-lg font-medium",
                          current && "bg-light-gray/50 border-l-4 border-secondary",
                        )}
                      >
                        <IconComponent icon={item.icon} />
                        {item.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Divider + bottom sections */}
            <div className="border-t border-border mt-8 pt-6 space-y-4">
              {/* Good to know */}
              <div className="bg-card border border-light-gray/95 rounded-2xl p-6">
                <p className="text-xl font-medium mb-4">Good to know</p>
                <Accordion defaultValue={[accordion[0].title]}>
                  {accordion.map((item) => (
                    <AccordionItem key={item.title} value={item.title}>
                      <AccordionTrigger className="font-medium py-3">{item.title}</AccordionTrigger>
                      <AccordionContent className="text-xs">{item.content}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Affiliate link */}
              <div className="bg-card border border-light-gray/95 rounded-2xl p-6">
                <p className="text-xl font-medium mb-2">Your affiliate link</p>
                {affiliate?.affiliateLink && (
                  <div className="flex items-center gap-2">
                    <a
                      href={affiliate.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs"
                    >
                      {affiliate.affiliateLink.replace(/^https?:\/\//, "")}
                    </a>
                    <CopyButton value={affiliate.affiliateLink} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
