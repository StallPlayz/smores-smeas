import { prisma } from '@/lib/prisma'

export default async function ProductsPage() {
  const products = await prisma.product.findMany()

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <p>{product.name}</p>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  )
}
