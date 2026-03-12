'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';

// Define the interface based on your Laravel Product model
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  stock: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Define your Laravel backend URL (adjust if running on a different port)
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Fetch products from Laravel API
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products`);
        const result = await response.json();
        
        if (result.status === 'success') {
          setProducts(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [BACKEND_URL]);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-gray-800 font-sans">
      <Head>
        <title>Smores Smeas | Deliciously Crafted</title>
      </Head>

      {/* Sticky Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        {/* ... (Navigation remains the same) ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-2xl font-bold text-[#8B5A2B]">Smores Smeas</div>
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#home" className="hover:text-[#D2691E] transition-colors">Home</a>
              <a href="#about-us" className="hover:text-[#D2691E] transition-colors">About Us</a>
              <a href="#about-product" className="hover:text-[#D2691E] transition-colors">The Product</a>
              <a href="#products" className="hover:text-[#D2691E] transition-colors">Shop</a>
              <a href="#contact" className="hover:text-[#D2691E] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section (Home) */}
      <section id="home" className="pt-24 pb-12 md:pt-32 md:pb-24 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
            Experience the <span className="text-[#D2691E]">Perfect S'more</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10">
            Elevating your campfire classics with premium ingredients, undeniable crunch, and a melt-in-your-mouth finish.
          </p>
          <a href="#products" className="inline-block bg-[#8B5A2B] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#6b4421] transition-transform transform hover:scale-105 shadow-lg">
            Explore the Menu
          </a>
        </div>
      </section>

      {/* About Us */}
      <section id="about-us" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-10 lg:mb-0">
              {/* Placeholder for an Image from your Mockup */}
              <div className="rounded-2xl bg-gray-200 aspect-video lg:aspect-square flex items-center justify-center text-gray-400 shadow-inner">
                [About Us Image]
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b-4 border-[#D2691E] pb-2 inline-block">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                What started as a simple late-night craving turned into an obsession with crafting the ultimate treat. We source the finest artisan marshmallows, small-batch graham crackers, and ethically traded chocolate to bring you a nostalgic experience upgraded for the modern palate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Product */}
      <section id="about-product" className="py-20 bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Our S'mores?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#8B5A2B]">Artisan Quality</h3>
              <p className="text-gray-600">Handcrafted ingredients that ensure every bite is perfectly balanced.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#8B5A2B]">Melted to Perfection</h3>
              <p className="text-gray-600">Our signature packaging ensures your treats are ready to enjoy instantly.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#8B5A2B]">Locally Sourced</h3>
              <p className="text-gray-600">Supporting local farmers and bakers to bring you the freshest experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product List */}
      <section id="products" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Browse our selection of ready-to-eat and DIY s'mores kits.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500 font-medium">
                Loading delicious treats...
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500 font-medium">
                No products available right now. Check back later!
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="group bg-[#FAFAF9] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="aspect-w-4 aspect-h-3 bg-gray-200 group-hover:bg-gray-300 transition-colors flex items-center justify-center text-gray-500 h-64 overflow-hidden relative">
                    {/* Constructing the full URL to the Laravel public storage */}
                    <img 
                      src={`${BACKEND_URL}/storage/products/${product.image}`} 
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                         // Fallback if image fails to load
                         (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h3>
                      <span className="text-lg font-semibold text-[#D2691E] ml-4">
                        {/* Format price depending on your currency logic */}
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm flex-grow line-clamp-3">
                      {product.description}
                    </p>
                    <button className="w-full bg-white border-2 border-[#8B5A2B] text-[#8B5A2B] font-semibold py-2 rounded-lg hover:bg-[#8B5A2B] hover:text-white transition-colors mt-auto">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#2C1E16] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-400">Have a question about an order or want to stock our products? Let us know.</p>
          </div>
          
          <form className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <input type="text" id="name" className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D2691E]" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input type="email" id="email" className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D2691E]" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <textarea id="message" rows={4} className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D2691E]" placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" className="w-full bg-[#D2691E] text-white font-bold py-4 rounded-lg hover:bg-[#b05615] transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A110D] py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Smores Smeas. All rights reserved.</p>
      </footer>
    </div>
  );
}