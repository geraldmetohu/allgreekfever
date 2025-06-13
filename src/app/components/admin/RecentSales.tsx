import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";

async function getData() {
  const data = await prisma.booking.findMany({
    select: {
      id: true,
      customer: true,
      email: true,
      total: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });
  return data;
}

export async function RecentSales() {
  const data = await getData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {data.map((item) => (
          <div className="flex items-center gap-4" key={item.id}>
            <Avatar className="hidden sm:flex h-9 w-9">
              <AvatarImage src={undefined} alt="Profile" />
              <AvatarFallback>
                {item.customer.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium">{item.customer}</p>
              <p className="text-sm text-muted-foreground">{item.email}</p>
            </div>
            <p className="ml-auto font-medium">
              +£{new Intl.NumberFormat("en-UK").format(item.total)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
