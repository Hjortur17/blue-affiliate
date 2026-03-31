"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

import { Icon, IconComponent } from "./Icon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import CopyButton from "./CopyButton";

const navigation: {
  name: string;
  href: string;
  icon: string;
  action?: string;
}[] = [
  { name: "Dashboard", href: "/", icon: "Car" },
  { name: "Performance", href: "/performance", icon: "ChartColumn" },
  { name: "Marketing material", href: "/marketing-material", icon: "LongArrowRight" },
  // { name: "Academy", href: "/academy", icon: "GraduationCap" },
  { name: "Request payout", href: "/payout", icon: "Info" },
  { name: "Log out", href: "#", icon: "LogOut", action: "logout" },
];

const accordion = [
  {
    title: "Price",
    content:
      "Price refers to the amount of money a customer pays to acquire a product or service. It not only reflects the value offered but also influences demand, competitiveness, and brand perception. A well-set price balances affordability for customers with profitability for the business.",
  },
  {
    title: "Invoice",
    content:
      "Price refers to the amount of money a customer pays to acquire a product or service. It not only reflects the value offered but also influences demand, competitiveness, and brand perception. A well-set price balances affordability for customers with profitability for the business.",
  },
  {
    title: "Cancel",
    content:
      "Price refers to the amount of money a customer pays to acquire a product or service. It not only reflects the value offered but also influences demand, competitiveness, and brand perception. A well-set price balances affordability for customers with profitability for the business.",
  },
  {
    title: "What is status",
    content:
      "Price refers to the amount of money a customer pays to acquire a product or service. It not only reflects the value offered but also influences demand, competitiveness, and brand perception. A well-set price balances affordability for customers with profitability for the business.",
  },
];

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { affiliate, logout } = useAuth();

  return (
    <aside className={cn("space-y-2.5", className)}>
      <div className="border border-light-gray rounded-2xl p-8">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => {
              const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={
                      item.action === "logout"
                        ? (e) => {
                            e.preventDefault();
                            logout();
                          }
                        : undefined
                    }
                    className={cn(
                      current &&
                        "h-15 flex items-center bg-light-gray/50 rounded-r-xl before:content-[''] before:absolute before:inset-y-0 before:left-0 before:h-full before:w-2 before:bg-secondary",
                      "hover:bg-light-gray/50 group flex gap-x-3.5 py-3 px-11 font-medium rounded-r-xl relative",
                    )}
                  >
                    <IconComponent icon={item.icon} className="shrink-0" size="lg" />
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="border border-light-gray rounded-2xl p-8">
        <p className="font-medium text-2xl mb-2.5">Good to know</p>

        <Accordion defaultValue={[accordion[0].title]}>
          {accordion.map((item) => (
            <AccordionItem key={item.title} value={item.title}>
              <AccordionTrigger className="text-base font-medium py-4">{item.title}</AccordionTrigger>
              <AccordionContent className="text-xs">{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="border border-light-gray rounded-2xl p-8">
        <p className="font-medium text-2xl mb-2.5">Your affiliate link</p>
        {affiliate?.affiliateLink && (
          <div className="flex items-center gap-2">
            <a href={affiliate.affiliateLink} target="_blank" rel="noopener noreferrer">
              {affiliate.affiliateLink.replace(/^https?:\/\//, "")}
            </a>
            <CopyButton value={affiliate.affiliateLink} />
          </div>
        )}
      </div>
    </aside>
  );
}
