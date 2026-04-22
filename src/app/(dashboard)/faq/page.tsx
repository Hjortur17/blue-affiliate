import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heading1 } from "@/components/ui/typography";
import { formatPrice } from "@/lib/utils";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqGroup = {
  id: string;
  title: string;
  description: string;
  items: FaqItem[];
};

// FAKE DATA — will come from a Prismic `faq_group` custom type (one document per
// group, with a repeatable `items` group field of { question, answer }).
const faqGroups: FaqGroup[] = [
  {
    id: "how-the-program-works",
    title: "How the Program Works",
    description: "Understanding the Blue Car Rental affiliate program",
    items: [
      {
        id: "how-does-it-work",
        question: "How does the affiliate program work?",
        answer:
          "You earn a commission on every confirmed rental that comes through your unique affiliate link. Payouts are processed twice a month.",
      },
      {
        id: "who-can-join",
        question: "Who can join the affiliate program?",
        answer:
          "Anyone with an audience — content creators, travel bloggers, tour operators, and agencies — can apply to become a Blue Car Rental affiliate.",
      },
      {
        id: "how-do-i-get-started",
        question: "How do I get started?",
        answer:
          "Sign up, grab your unique link from the sidebar, and start sharing. Your performance and earnings appear on the dashboard.",
      },
    ],
  },
  {
    id: "commission-structure",
    title: "Commission Structure",
    description: "Understanding how you earn and when commissions are confirmed",
    items: [],
  },
  {
    id: "pricing-and-revenue",
    title: "Pricing & Revenue",
    description: "How rental pricing works and affects your commission",
    items: [],
  },
  {
    id: "booking-and-delivery-status",
    title: "Booking & Delivery Status",
    description: "Understanding different status indicators",
    items: [],
  },
  {
    id: "invoicing-and-payments",
    title: "Invoicing & Payments",
    description: "How invoicing and payouts work",
    items: [],
  },
  {
    id: "cancellations-and-modifications",
    title: "Cancellations & Modifications",
    description: "What happens when bookings are cancelled or changed",
    items: [],
  },
  {
    id: "link-tracking-and-sub-ids",
    title: "Link Tracking & Sub-IDs",
    description: "Optimizing your marketing with tracking parameters",
    items: [],
  },
  {
    id: "best-practices-and-tips",
    title: "Best Practices & Tips",
    description: "Maximizing your affiliate earnings",
    items: [],
  },
];

export default function FaqPage() {
  return (
    <div>
      <section>
        <div className="space-y-2">
          <Heading1 className="text-2xl">Help & Information</Heading1>
          <p className="text-muted-foreground">
            Everything you need to know about the Blue Car Rental affiliate program
          </p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-3 rounded-lg border border-[#bedbff] bg-linear-to-br from-[#eff6ff] to-[#dbeafe] p-5 text-[#1c398e]">
          <p className="text-sm font-bold">Commission Rate</p>
          <p className="text-2xl">X%</p>
          <p className="text-xs">On all confirmed rentals</p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-primary bg-[#101828] p-5 text-white">
          <p className="text-sm font-bold">Payment Schedule</p>
          <p className="text-xl">1st & 15th</p>
          <p className="text-xs">Twice monthly processing</p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-[#bedbff] bg-[#bedbff] p-5 text-[#101828]">
          <p className="text-sm font-bold">Min. Payout</p>
          <p className="text-xl">{formatPrice(50000)}</p>
          <p className="text-xs">Minimum threshold</p>
        </div>
      </section>

      <section className="mt-8">
        <Accordion className="flex flex-col gap-4">
          {faqGroups.map((group) => (
            <AccordionItem
              key={group.id}
              value={group.id}
              className="overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white"
            >
              <AccordionTrigger className="p-6 items-center hover:no-underline">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-[#0a0a0a]">{group.title}</span>
                  <span className="text-sm font-normal text-[#4a5565]">{group.description}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="border-t border-[#e5e7eb] bg-[#f9fafb] px-6 pt-6 pb-6">
                <Accordion className="flex flex-col gap-3">
                  {group.items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white"
                    >
                      <AccordionTrigger className="p-4 text-[15px] font-medium text-[#101828] hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-0 pb-4 text-sm text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-8 rounded-lg bg-linear-to-b md:bg-linear-to-r from-secondary to-[#f54900] p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-bold text-white">Still have questions?</p>
            <p className="text-secondary-muted">Our support team is here to help you succeed as an affiliate partner.</p>
          </div>
          <a
            href="mailto:affiliates@bluecarrental.is"
            className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-white text-secondary font-medium whitespace-nowrap"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}
