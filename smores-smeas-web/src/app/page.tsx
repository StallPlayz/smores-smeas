"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
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

  // State for popups (Modals)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // NEW: State for the Carousel
  const [activeIndex, setActiveIndex] = useState(0);

  const nextProduct = () => {
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevProduct = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products`);
        const result = await response.json();

        if (result.status === "success") {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [BACKEND_URL]);

  return (
    <div className="min-h-screen max-w-screen overflow-hidden bg-[#bfa28c] text-gray-800 font-sans">
      <Head>
        <title>Smores Smeas | Deliciously Crafted</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Knewave&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* HEADER WRAPPER - Invisible layer holding both navigation elements */}
      <header className="fixed w-full z-50 top-0 pointer-events-none">
        <nav className="flex justify-center drop-shadow-md pt-4 px-4">
          <div className="relative bg-[#babf94] w-full md:w-[80%] max-w-xl rounded-[2.5rem] px-4 py-4 flex justify-center items-center pointer-events-auto">
            {/* Main Brand Drip */}
            <img
              src="/drip-right.webp"
              alt="Brand Drip"
              className="absolute -right-2 md:right-4 -bottom-12 w-16 h-auto pointer-events-none -mt-[1px]"
            />

            {/* Main Links */}
            <div className="flex items-center space-x-6 md:space-x-12 text-white font-bold text-sm md:text-base">
              <a
                href="#home"
                className="hover:text-[#5C3D2E] transition-colors drop-shadow-sm"
              >
                Home
              </a>
              <a
                href="#about-us"
                className="hover:text-[#5C3D2E] transition-colors drop-shadow-sm"
              >
                About Us
              </a>
              <a
                href="#about-product"
                className="hover:text-[#5C3D2E] transition-colors drop-shadow-sm"
              >
                Why Us?
              </a>
              <a
                href="#products"
                className="hover:text-[#5C3D2E] transition-colors drop-shadow-sm"
              >
                Products
              </a>
              <a
                href="#contact"
                className="hover:text-[#5C3D2E] transition-colors drop-shadow-sm"
              >
                Contact
              </a>
            </div>
          </div>
        </nav>

        {/* 2. FLOATING LOGIN BUTTON (Top Right) */}
        <div className="absolute top-6 right-4 md:right-8 pointer-events-auto drop-shadow-md">
          <div className="relative">
            <button className="bg-[#babf94] text-white font-bold text-sm md:text-base px-6 py-2 rounded-full hover:text-[#5C3D2E] transition-colors drop-shadow-sm">
              Login
            </button>

            {/* Small Login Drip */}
            <img
              src="/drip-small.webp"
              alt="Small Drip"
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-auto pointer-events-none -mt-[1px]"
            />
          </div>
        </div>
      </header>

      {/* Hero Section (Home) */}
      <section
        id="home"
        className="pt-32 pb-12 flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
      >
        {/* Quick font import fix for Next.js App Router */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Knewave&display=swap');
        `,
          }}
        />

        {/* This wrapper keeps the image and text glued together perfectly */}
        <div className="relative flex flex-col items-center justify-center mt-12 md:mt-20 w-full">
          {/* LAYER 1 (BACK): Solid "S'mores" Text */}
          <div className="absolute bottom-[55%] md:bottom-[85%] left-1/2 -translate-x-1/2 w-max z-0 pointer-events-none select-none">
            <h1
              className="text-[7rem] md:text-[15rem] leading-none text-[#F3E4C9] text-center tracking-wider"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              S'mores
            </h1>
          </div>

          {/* LAYER 2 (MIDDLE): The Signature Dish Image */}
          <div className="relative z-10 w-full max-w-lg md:max-w-3xl px-4 flex justify-center -mt-[16rem]">
            <img
              src="/smores.webp"
              alt="Signature S'more"
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>

          {/* LAYER 3 (FRONT): Outline "S'mores" Text + DRIPS */}
          <div className="absolute bottom-[55%] md:bottom-[85%] left-1/2 -translate-x-1/2 w-max z-20 pointer-events-none select-none">
            <h1
              className="text-[7rem] md:text-[15rem] leading-none text-transparent text-center tracking-wider"
              style={{
                fontFamily: "'Knewave', cursive",
                WebkitTextStroke: "3px white",
              }}
            >
              S'mores
            </h1>

            {/* TITLE DRIP LEFT */}
            <img
              src="/drip-title-left.webp"
              alt="Left Title Drip"
              className="absolute w-12 md:w-24 h-auto bottom-[5%] md:bottom-[-45%] left-[0%] md:left-[2%]"
            />

            {/* TITLE DRIP RIGHT */}
            <img
              src="/drip-title-right.webp"
              alt="Right Title Drip"
              className="absolute w-12 md:w-24 h-auto bottom-[5%] md:bottom-[-59%] right-[2%] md:right-[4%]"
            />
          </div>

          {/* LAYER 4 (FRONT BOTTOM): The "Smeas" Text */}
          <h2
            className="absolute z-20 text-[6rem] md:text-[12rem] leading-none text-[#EBE0D0] -mb-24 md:-mb-48 text-center select-none drop-shadow-md"
            style={{ fontFamily: "'Knewave', cursive" }}
          >
            Smeas
          </h2>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b-4 border-[#D2691E] pb-2 inline-block">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                What started as a simple late-night craving turned into an
                obsession with crafting the ultimate treat. We source the finest
                artisan marshmallows, small-batch graham crackers, and ethically
                traded chocolate to bring you a nostalgic experience upgraded
                for the modern palate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Product */}
      <section id="about-product" className="py-20 bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Why Our S'mores?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#8B5A2B]">
                Artisan Quality
              </h3>
              <p className="text-gray-600">
                Handcrafted ingredients that ensure every bite is perfectly
                balanced.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#8B5A2B]">
                Melted to Perfection
              </h3>
              <p className="text-gray-600">
                Our signature packaging ensures your treats are ready to enjoy
                instantly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#8B5A2B]">
                Locally Sourced
              </h3>
              <p className="text-gray-600">
                Supporting local farmers and bakers to bring you the freshest
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="products" className="py-24 bg-[#F3E8D6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          {/* THE PRODUCT TITLE PILL */}
          <div className="bg-[#A98B76] px-12 md:px-20 py-3 md:py-4 rounded-[2rem] md:rounded-full mb-24 shadow-md">
            <h2 
              className="text-4xl md:text-5xl text-[#F4EBD9] tracking-wider select-none"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              Products
            </h2>
          </div>
          
          {/* CAROUSEL CONTAINER */}
          <div className="relative w-full max-w-5xl flex items-center justify-center min-h-[400px]">
            {loading ? (
              <div className="text-[#A68A77] font-medium text-2xl" style={{ fontFamily: "'Knewave', cursive" }}>
                Loading...
              </div>
            ) : products.length === 0 ? (
              <div className="text-[#A68A77] font-medium text-xl">
                No products available right now.
              </div>
            ) : (
              <>
                {/* Left Arrow Button */}
                <button 
                  onClick={prevProduct}
                  className="absolute left-0 md:left-4 z-30 bg-white text-black rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg font-extrabold text-2xl hover:bg-gray-100 transition-transform hover:scale-110"
                >
                  &#10094;
                </button>

                {/* The Products Showcase */}
                <div className="flex items-center justify-center gap-4 md:gap-12 w-full">
                  {products.map((product, index) => {
                    // Determine if this card is active, prev, or next
                    const isActive = index === activeIndex;
                    const isPrev = index === (activeIndex === 0 ? products.length - 1 : activeIndex - 1);
                    const isNext = index === (activeIndex === products.length - 1 ? 0 : activeIndex + 1);

                    // Only render the active, previous, and next cards in the DOM
                    if (!isActive && !isPrev && !isNext && products.length > 2) return null;

                    return (
                      <div 
                        key={product.id} 
                        onClick={() => setActiveIndex(index)}
                        className={`relative transition-all duration-500 cursor-pointer flex flex-col items-center justify-center bg-[#A98B76] rounded-[2rem] md:rounded-[3rem] ${
                          isActive 
                            ? "w-64 h-[22rem] md:w-80 md:h-[26rem] z-20 scale-100 opacity-100 shadow-xl" 
                            : "w-48 h-56 md:w-56 md:h-64 z-10 scale-90 opacity-50 shadow-md hidden sm:flex"
                        }`}
                      >
                        {/* Image Drip built directly into the active card */}
                        {isActive && (
                          <img 
                            src="/product-drip.webp" 
                            alt="Card Drip" 
                            className="absolute -bottom-14 right-0 w-12 md:w-16 h-auto pointer-events-none"
                          />
                        )}

                        {/* Product Image popping out the top */}
                        <div className={`absolute ${isActive ? "-top-16 md:-top-24 w-48 md:w-64" : "-top-12 w-36 md:w-48"} drop-shadow-xl transition-all duration-500`}>
                          <img 
                            src={`${BACKEND_URL}/storage/products/${product.image}`} 
                            alt={product.name}
                            className="w-full h-auto object-contain hover:scale-105 transition-transform"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Smore'; }}
                          />
                        </div>

                        {/* Product Details (Only visible on active card) */}
                        {isActive && (
                          <div className="mt-20 md:mt-24 flex flex-col items-center">
                            <h3 
                              className="text-[#F4EBD9] text-2xl md:text-3xl tracking-wider mb-6 text-center px-4"
                              style={{ fontFamily: "'Knewave', cursive" }}
                            >
                              {product.name}
                            </h3>
                            
                            {/* Connects to your existing Modal state! */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents the card click from firing
                                setSelectedProduct(product);
                              }}
                              className="bg-[#EBE0D0] text-[#8C6F5A] px-8 py-2 md:px-10 md:py-3 rounded-full font-bold text-lg hover:brightness-105 transition-colors drop-shadow-md"
                              style={{ fontFamily: "'Knewave', cursive" }}
                            >
                              Buy Now
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right Arrow Button */}
                <button 
                  onClick={nextProduct}
                  className="absolute right-0 md:right-4 z-30 bg-white text-black rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg font-extrabold text-2xl hover:bg-gray-100 transition-transform hover:scale-110"
                >
                  &#10095;
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#2C1E16] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-400">
              Have a question about an order or want to stock our products? Let
              us know.
            </p>
          </div>

          <form className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
                placeholder="How can we help?"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#D2691E] text-white font-bold py-4 rounded-lg hover:bg-[#b05615] transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A110D] py-8 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Smores Smeas. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
