import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icon } from '@/components/icons'

interface ProductData {
    title: string;
    price: number;
    sold: number;
    imageUrl: string;
    stock: number;
}

interface ProductsSectionProps {
    products: ProductData[];
}

// Product Card Component
const ProductCard: React.FC<{ product: ProductData }> = ({ product }) => {
    return (
        <Card className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
                <Image
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-44 object-cover"
                    width={400}
                    height={220}
                />
                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{product.title}</h3>
                    <div className="text-xl font-medium text-gray-900 mb-2">
                        ${product.price.toFixed(2)}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600 text-sm">
                            <Icon name="ShoppingCart" className="h-4 w-4 mr-1" />
                            <span>{product.sold} sold</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                            <span>{product.stock} in stock</span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <Link href={`/organization/items/edit/${product.title.toLowerCase().replace(/\s+/g, '-')}`} passHref>
                            <Button variant="outline" size="sm">
                                Edit
                            </Button>
                        </Link>
                        <Link href={`/organization/items/${product.title.toLowerCase().replace(/\s+/g, '-')}`} passHref>
                            <Button variant="ghost" size="sm">
                                View Details
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Create Product Card
const CreateProductCard: React.FC = () => (
    <Link href="/organization/items" passHref>
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center h-full min-h-60 cursor-pointer">
            <CardContent className="p-6 text-center">
                <div className="rounded-full bg-gray-100 p-3 mx-auto mb-4 w-fit">
                    <Icon name="Plus" className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Add New Product</h3>
                <p className="text-sm text-gray-500">Create merchandise or digital goods to sell</p>
            </CardContent>
        </Card>
    </Link>
)

// Empty State Component
const EmptyState: React.FC = () => (
    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400">
        <CardContent className="p-12 text-center">
            <div className="rounded-full bg-gray-100 p-4 mx-auto mb-4 w-fit">
                <Icon name="ShoppingCart" className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Products Yet</h3>
            <p className="text-gray-500 mb-6">Create your first product to start selling</p>
            <Link href="/organization/items" passHref>
                <Button>
                    <Icon name="Plus" className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </Link>
        </CardContent>
    </Card>
)

// Main Component
const ProductsSection: React.FC<ProductsSectionProps> = ({ products }) => {
    return (
        <div className="mb-8">
            <Tabs defaultValue="products" className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="products">My Products</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                        <Link href="/organization/categories" passHref>
                            <Button variant="ghost" size="sm">
                                See All
                            </Button>
                        </Link>
                    </div>
                </div>

                <TabsContent value="products" className="mt-0">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                            <CreateProductCard />
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ProductsSection