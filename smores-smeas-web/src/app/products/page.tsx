import { prisma } from '@/lib/prisma'

export default async function ProductsPage() {
  const products = await prisma.products.findMany()

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <p>{product.name}</p>
          <p>{product.description}</p>
          <p>{product.price.toString()}</p>
          <p>{product.stock}</p>
        </div>
      ))}
    </div>
  )
}
