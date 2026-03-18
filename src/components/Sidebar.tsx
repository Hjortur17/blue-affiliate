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
      <div className="border border-light-gray rounded-2xl px-8 py-5"></div>

      <div className="border border-light-gray rounded-2xl px-8 py-5">
        <p className="font-medium text-2xl mb-2.5">Good to know</p>
      </div>

      <div className="border border-light-gray rounded-2xl px-8 py-5">
        <p className="font-medium text-2xl mb-2.5">Your affiliate link</p>
        <a href="#" className="www.bluecarrental.is/sfvero" target="_blank">
          www.bluecarrental.is/sfvero
        </a>
      </div>
    </aside>
  );
}
