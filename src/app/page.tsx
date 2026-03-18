import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsGrid from "@/components/StatsGrid";

export default function Home() {
  return (
    <section>
      <Tabs defaultValue="booking-data" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="booking-data">Booking Data</TabsTrigger>
          <TabsTrigger value="delivery-data">Delivery Data</TabsTrigger>
        </TabsList>

        <TabsContent value="booking-data">
          <BookingData />
        </TabsContent>
        <TabsContent value="delivery-data">
          <DeliveryData />
        </TabsContent>
      </Tabs>
    </section>
  );
}

const BookingData = () => {
  return <StatsGrid />;
};

const DeliveryData = () => {
  return <p>Delivery Data</p>;
};
