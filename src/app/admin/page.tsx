import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurreny, formatNumber } from "@/lib/formatters";

async function getSalesData() {
  const data = await db?.order.aggregate({
    _sum: { priceInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum.priceInCents || 0) / 10,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { priceInCents: true },
    }),
  ]);
  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.priceInCents || 0) / userCount / 100,
  };
}

async function getProductData() {
  const [activeCount, inActiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableforPurchase: true } }),
    db.product.count({ where: { isAvailableforPurchase: false } }),
  ]);
  return { active: activeCount, inActive: inActiveCount };
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    await getSalesData(),
    await getUserData(),
    await getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurreny(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurreny(
          userData.averageValuePerUser
        )} Average Value`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productData.inActive)} Inactive`}
        body={formatNumber(productData.active)}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
