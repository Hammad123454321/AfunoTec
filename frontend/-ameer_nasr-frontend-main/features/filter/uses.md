# server-side

import { FilterPanel } from "@/features/filter/components/FilterWidget";
import { parseFiltersFromSearchParams } from "@/features/filter/lib/filterUtils";
import type { FilterConfig } from "@/features/filter/types";

interface PageProps {
searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Fetch filters from your API
async function getFilters(
filters: Record<string, string | string[]>
): Promise<FilterConfig> {
const params = new URLSearchParams();
Object.entries(filters).forEach(([key, value]) => {
params.set(key, JSON.stringify(value));
});

const res = await fetch(
`https://api.example.com/filters?${params.toString()}`,
{
cache: "no-store",
}
);

if (!res.ok) throw new Error("Failed to fetch filters");
return res.json();
}

// Fetch products from your API
async function getProducts(filters: Record<string, string | string[]>) {
const params = new URLSearchParams();
Object.entries(filters).forEach(([key, value]) => {
params.set(key, JSON.stringify(value));
});

const res = await fetch(
`https://api.example.com/products?${params.toString()}`,
{
cache: "no-store",
}
);

if (!res.ok) throw new Error("Failed to fetch products");
return res.json();
}

export default async function ProductsPage({ searchParams }: PageProps) {
// Next.js 15: searchParams is a Promise
const resolvedParams = await searchParams;
const filters = parseFiltersFromSearchParams(resolvedParams);

// Fetch data in parallel
const [filterConfig, productsData] = await Promise.all([
getFilters(filters),
getProducts(filters),
]);

return (

<div className="flex gap-6 p-6">
<FilterPanel config={filterConfig} />

      <main className="flex-1">
        <h1 className="text-2xl font-semibold mb-4">
          Products ({productsData.items.length})
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productsData.items.map((product: any) => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-green-600 font-semibold">${product.price}</p>
            </div>
          ))}
        </div>
      </main>
    </div>

);
}

"use client";

import { FilterPanel } from "@/features/filter/components/FilterWidget";
import { FilterConfig } from "@/features/filter/types";

export default function DemoPage() {
const filterConfig: FilterConfig = {
filters: [
{
id: "category",
label: "Category",
type: "checkbox",
options: [
{ value: "electronics", label: "Electronics", count: 150 },
{ value: "clothing", label: "Clothing", count: 89 },
{ value: "books", label: "Books", count: 234 },
],
},
{
id: "brand",
label: "Brand",
type: "radio",
options: [
{ value: "apple", label: "Apple", count: 45 },
{ value: "samsung", label: "Samsung", count: 38 },
{ value: "sony", label: "Sony", count: 29 },
],
},
{
id: "price",
label: "Price Range",
type: "checkbox",
options: [
{ value: "0-50", label: "Under $50", count: 156 },
{ value: "50-100", label: "$50 - $100", count: 98 },
{ value: "100-200", label: "$100 - $200", count: 72 },
],
},
],
};

return (

<div className="min-h-screen bg-gray-100 p-6">
<div className="max-w-7xl mx-auto">
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
<h2 className="font-semibold text-blue-900 mb-2">
✅ Next.js 15 SSR Ready!
</h2>
<ul className="text-sm text-blue-800 space-y-1">
<li>• Server Component first approach</li>
<li>• Works with async searchParams (Next.js 15)</li>
<li>• URL state with useTransition</li>
<li>• No client-side filtering logic needed</li>
<li>• SEO friendly - filters in URL</li>
</ul>
</div>

        <div className="flex gap-6">
          <FilterPanel config={filterConfig} />

          <main className="flex-1">
            <div className="bg-white rounded-lg p-6">
              <h1 className="text-2xl font-semibold mb-4">Products</h1>
              <p className="text-gray-600">
                Your server component will render filtered products here based
                on URL params.
              </p>
              <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
                {`// Server Component Example:

const filters = parseFiltersFromSearchParams(await searchParams);
const products = await getProducts(filters);

// Products are fetched server-side with filters applied`}

</pre>
</div>
</main>
</div>
</div>
</div>
);
}
