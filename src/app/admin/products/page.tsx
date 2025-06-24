// src/app/admin/products/page.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAdminEmails } from "@/app/actions";
import ProductForm from "@/app/components/admin/ProductForm";
import ProductList from "@/app/components/admin/ProductList";


export default async function ProductsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.email) return redirect("/");

  const adminEmails = await getAdminEmails();
  if (!adminEmails.includes(user.email)) return redirect("/");

  const products = await prisma.products.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-500">Product Management</h1>
      <ProductForm />
      <ProductList products={products} />
    </div>
  );
}
