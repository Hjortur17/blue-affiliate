import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

import { IconComponent, Icon } from "./Icon";

import { cn } from "@/lib/utils";

const navigation: {
  name: string;
  href: string;
  icon: keyof typeof Icon;
  current: boolean;
}[] = [
  { name: "Dashboard", href: "#", icon: "Car", current: true },
  { name: "Performance", href: "#", icon: "Graph", current: false },
  {
    name: "Marketing material",
    href: "#",
    icon: "LongArrowRight",
    current: false,
  },
  { name: "Academy", href: "#", icon: "GraduationCap", current: false },
  {
    name: "Request payout",
    href: "#",
    icon: "Information",
    current: false,
  },
  { name: "Log out", href: "#", icon: "LogOut", current: false },
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

export default function Sidebar() {
  return (
    <aside className="col-span-4 space-y-2.5">
      <div className="border border-light-gray rounded-2xl p-8">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => {
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={cn(
                      item.current &&
                        "h-15 flex items-center bg-light-gray/50 rounded-r-xl before:content-[''] before:absolute before:inset-y-0 before:left-0 before:h-full before:w-2 before:bg-secondary",
                      "hover:bg-light-gray/50 group flex gap-x-3.5 py-3 px-11 font-medium rounded-r-xl relative",
                    )}
                  >
                    <IconComponent
                      icon={item.icon}
                      className="shrink-0 size-7"
                    />
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
              <AccordionTrigger className="text-base font-medium py-4">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-xs">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="border border-light-gray rounded-2xl p-8">
        <p className="font-medium text-2xl mb-2.5">Your affiliate link</p>
        <a href="#" className="www.bluecarrental.is/sfvero" target="_blank">
          www.bluecarrental.is/sfvero
        </a>
      </div>
    </aside>
  );
}
