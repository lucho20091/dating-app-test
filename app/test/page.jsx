import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ErrorMessage from "@/components/ErrorMessage";
export default async function page() {
  const user = await getCurrentUser();
  console.log(user);
  const products = await prisma.product.findMany();
  console.log(products);
  return (
    <div className="px-4">
      test
      {products.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
      <ErrorMessage>this is a test lol</ErrorMessage>
    </div>
  );
}
