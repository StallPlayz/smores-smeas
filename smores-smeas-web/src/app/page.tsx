"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import {
  FaStar,
  FaFire,
  FaTags,
  FaHeart,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useScrollReveal } from "../lib/useScrollReveal";
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  stock: number;
}

const ThemeDivider = ({
  colorClass,
  position = "top",
  flipHorizontal = false,
  type = "drip",
}: {
  colorClass: string;
  position?: "top" | "bottom";
  flipHorizontal?: boolean;
  type?: "drip" | "marshmallow" | "cracker" | "wave";
}) => {
  const paths = {
    drip: "M0,0 V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
    marshmallow:
      "M0,0 V40 Q75,100 150,40 T300,40 T450,40 T600,40 T750,40 T900,40 T1050,40 T1200,40 V0 Z",
    cracker:
      "M0,0 V30 L60,90 L120,30 L180,90 L240,30 L300,90 L360,30 L420,90 L480,30 L540,90 L600,30 L660,90 L720,30 L780,90 L840,30 L900,90 L960,30 L1020,90 L1080,30 L1140,90 L1200,30 V0 Z",
    wave: "M0,0 V60 C400,120 800,0 1200,60 V0 Z",
  };

  return (
    <div
      className={`absolute left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none ${
        position === "bottom" ? "bottom-0 rotate-180" : "top-0"
      } ${flipHorizontal ? "-scale-x-100" : ""}`}
    >
      <svg
        className="relative block w-full h-[50px] md:h-[100px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d={paths[type]}
          className={colorClass}
          fill="currentColor"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
    </div>
  );
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalMounted, setIsLoginModalMounted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isFormAnimVisible, setIsFormAnimVisible] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const openModal = (product: Product) => {
    setModalProduct(product);
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalProduct(null), 300);
  };

  const openLoginModal = () => {
    setIsAuthLoading(false);
    setIsRegisterMode(false);
    setAuthForm({ name: "", email: "", password: "" });
    setIsFormAnimVisible(true);

    setIsLoginModalMounted(true);
    setTimeout(() => setIsLoginModalOpen(true), 10);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);

    setTimeout(() => {
      setIsLoginModalMounted(false);
      setIsRegisterMode(false);
      setAuthForm({ name: "", email: "", password: "" });
      setIsAuthLoading(false);
    }, 300);
  };

  const toggleAuthMode = () => {
    setIsFormAnimVisible(false);

    setTimeout(() => {
      setIsRegisterMode((prev) => !prev);
      setIsFormAnimVisible(true);
    }, 300);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);

    const endpoint = isRegisterMode ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegisterMode
      ? {
          name: authForm.name,
          email: authForm.email,
          password: authForm.password,
        }
      : { email: authForm.email, password: authForm.password };

    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        closeLoginModal();
      } else {
        const errorMsg =
          data.message ||
          (isRegisterMode ? "Registration failed." : "Login failed.");
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLogoutLoading(false);
    }
  };

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [aboutStep, setAboutStep] = useState(0);

  const [isExploded, setIsExploded] = useState(false);
  const heroReveal = useScrollReveal();
  const aboutReveal = useScrollReveal();
  const whyUsReveal = useScrollReveal();
  const productsReveal = useScrollReveal();
  const contactReveal = useScrollReveal();

  {
    /* S'mores animation timer */
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setIsExploded((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  {
    /* Description scroll timer */
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setAboutStep((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextProduct = () => {
    if (activeIndex < products.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const prevProduct = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products`);
        const result = await response.json();

        if (response.ok) {
          if (result.data && Array.isArray(result.data)) {
            setProducts(result.data);
          }
          else if (Array.isArray(result)) {
            setProducts(result);
          }
          else if (result.status === "success") {
            setProducts(result.data);
          }
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
    <div className="min-h-screen max-w-screen overflow-hidden bg-[#bfa28c] text-gray-800 font-sans select-none">
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

      {/* HEADER WRAPPER */}
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
                href="#why-us"
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
            {user ? (
              <button
                onClick={handleLogout}
                disabled={isLogoutLoading}
                className={`bg-[#5C3D2E] text-white font-bold text-sm md:text-base px-6 py-2 rounded-full transition-colors drop-shadow-sm ${
                  isLogoutLoading
                    ? "opacity-70 cursor-wait"
                    : "hover:bg-red-800"
                }`}
              >
                {isLogoutLoading ? "Memproses..." : `Logout (${user.name})`}
              </button>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="bg-[#babf94] text-white font-bold text-sm md:text-base px-6 py-2 rounded-full hover:text-[#5C3D2E] transition-colors drop-shadow-sm"
                >
                  Login
                </button>
                {/* Small Login Drip */}
                <img
                  src="/drip-small.webp"
                  alt="Small Drip"
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-auto pointer-events-none -mt-[1px]"
                />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section (Home) */}
      <section
        id="home"
        className="pt-32 pb-12 flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
      >
        {/* Quick font import fix for Next.js App Router (will be changed) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Knewave&display=swap');
        `,
          }}
        />
        {/* Title Wrapper */}
        <div
          ref={heroReveal.ref}
          className={`relative flex flex-col items-center justify-center mt-12 md:mt-20 w-full transition-all duration-1000 ease-out ${
            heroReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
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
        <ThemeDivider
          colorClass="text-[#8C6F5A]"
          position="bottom"
          type="drip"
        />{" "}
      </section>

      {/* About Us Section */}
      <section
        id="about-us"
        className="relative py-24 bg-[#8C6F5A] relative overflow-hidden"
      >
        <div
          ref={aboutReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center transition-all duration-1000 ease-out delay-100 ${
            aboutReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {/* THE ABOUT US TITLE PILL */}
          <div className="bg-[#BFA28C] px-12 md:px-20 py-3 md:py-4 rounded-[2rem] md:rounded-full mb-16 shadow-md drop-shadow-sm">
            <h2
              className="text-4xl md:text-5xl text-[#F3E4C9] tracking-wider select-none"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              About Us
            </h2>
          </div>

          {/* Content Layout: 2 Columns on Desktop, Stacked on Mobile */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center w-full max-w-5xl">
            {/* Left Column: Animated Exploding S'more */}
            <div className="relative flex justify-center items-center h-80 md:h-[28rem] w-full">
              {/* The background circle */}
              <div className="absolute w-64 h-64 md:w-80 md:h-80 bg-[#BFA28C] rounded-full shadow-inner opacity-90"></div>

              {/* THE ANIMATED 4-LAYER S'MORE */}
              <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center left-2 -mt-[-1rem]">
                {/* 4. Bottom Graham Cracker (Back Layer) */}
                <img
                  src="/smore-layer-1.webp"
                  alt="Bottom Graham Cracker"
                  className={`absolute inset-0 w-full h-full left-1 object-contain drop-shadow-lg transition-all duration-[1500ms] ease-in-out ${
                    isExploded
                      ? "translate-y-16 md:translate-y-24 scale-105"
                      : "translate-y-6 md:translate-y-8 scale-100"
                  }`}
                />

                {/* 3. Chocolate Layer */}
                <img
                  src="/smore-layer-3-chocolate.webp"
                  alt="Chocolate"
                  className={`absolute inset-0 w-full h-full object-contain drop-shadow-lg transition-all duration-[1500ms] ease-in-out ${
                    isExploded
                      ? "translate-y-4 md:translate-y-8 scale-105"
                      : "translate-y-2 md:translate-y-3 scale-100"
                  }`}
                />

                {/* 2. Marshmallow Layer */}
                <img
                  src="/smore-layer-2-marshmallow.webp"
                  alt="Marshmallow"
                  className={`absolute inset-0 w-full h-full object-contain drop-shadow-xl transition-all duration-[1500ms] ease-in-out ${
                    isExploded
                      ? "-translate-y-8 md:-translate-y-10 scale-105"
                      : "-translate-y-2 md:-translate-y-3 scale-100"
                  }`}
                />

                {/* 1. Top Graham Cracker (Front Layer) */}
                <img
                  src="/smore-layer-1.webp"
                  alt="Top Graham Cracker"
                  className={`absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-all duration-[1500ms] ease-in-out ${
                    isExploded
                      ? "-translate-y-20 md:-translate-y-28 scale-105"
                      : "-translate-y-6 md:-translate-y-8 scale-100"
                  }`}
                />
              </div>
            </div>

            {/* Right Column: Text Content */}
            <div className="flex-1 flex flex-col justify-center gap-6 text-[#F4EBD9] text-center md:text-left mt-10 md:mt-0">
              {/* Bubbly Subheading */}
              <h3
                className="flex items-center justify-center md:justify-start gap-3 text-4xl md:text-5xl drop-shadow-md text-[#EBE0D0] mb-2"
                style={{ fontFamily: "'Margarine', sans-serif" }}
              >
                Cerita Manis Kami{" "}
                <FaStar className="text-3xl md:text-4xl text-[#F3E8D6]" />
              </h3>

              {/* Dynamic Paragraph Wrapper (Now with a sliding flexbox!) */}
              <div className="relative overflow-hidden w-full min-h-[240px] md:min-h-[320px]">
                <div
                  className="absolute top-0 left-0 w-full h-full flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${aboutStep * 100}%)` }}
                >
                  {/* Paragraph 1 */}
                  <div className="w-full shrink-0 flex items-center pr-4">
                    <p className="text-xl md:text-2xl font-medium leading-relaxed opacity-95 text-justify">
                      <strong
                        className="text-3xl text-[#EBE0D0] font-black tracking-wide pr-2"
                        style={{ fontFamily: "'Margarine', sans-serif" }}
                      >
                        S'mores Smeas
                      </strong>
                      lahir dari kecintaan kami terhadap cita rasa klasik dan
                      momen penuh kehangatan. Kami memadukan pesona nostalgia
                      s'mores tradisional dengan inovasi modern, menghadirkan
                      harmoni sempurna antara marshmallow lembut, cokelat
                      premium, dan biskuit yang renyah.
                    </p>
                  </div>

                  {/* Paragraph 2 */}
                  <div className="w-full shrink-0 flex items-center pr-4">
                    <p className="text-xl md:text-2xl font-medium leading-relaxed opacity-95 text-justify">
                      Misi kami sederhana: memberikan pengalaman dalam menikmati
                      camilan berkualitas tinggi yang praktis dan siap menemani
                      hari Anda. Setiap porsi diracik oleh tangan kreatif siswa
                      SMKN 1 Surabaya dengan dedikasi penuh untuk mengubah waktu
                      istirahat menjadi momen manis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                {/* Left Button */}
                <button
                  onClick={() => setAboutStep(0)}
                  disabled={aboutStep === 0}
                  className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                    aboutStep === 0
                      ? "bg-[#A68A77]/40 text-[#F4EBD9]/40 cursor-not-allowed shadow-none"
                      : "bg-[#EBE0D0] text-[#8C6F5A] shadow-md hover:scale-105 hover:bg-white"
                  }`}
                >
                  <FaChevronLeft className="text-xl" />
                </button>

                {/* Interactive Pagination Dots */}
                <div className="flex gap-2 mx-4">
                  <div
                    onClick={() => setAboutStep(0)}
                    className={`h-3 rounded-full transition-all duration-500 cursor-pointer ${aboutStep === 0 ? "w-10 bg-[#EBE0D0]" : "w-3 bg-[#A68A77] hover:bg-[#EBE0D0]/50"}`}
                  ></div>
                  <div
                    onClick={() => setAboutStep(1)}
                    className={`h-3 rounded-full transition-all duration-500 cursor-pointer ${aboutStep === 1 ? "w-10 bg-[#EBE0D0]" : "w-3 bg-[#A68A77] hover:bg-[#EBE0D0]/50"}`}
                  ></div>
                </div>

                {/* Right Button */}
                <button
                  onClick={() => setAboutStep(1)}
                  disabled={aboutStep === 1}
                  className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                    aboutStep === 1
                      ? "bg-[#A68A77]/40 text-[#F4EBD9]/40 cursor-not-allowed shadow-none"
                      : "bg-[#EBE0D0] text-[#8C6F5A] shadow-md hover:scale-105 hover:bg-white"
                  }`}
                >
                  <FaChevronRight className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-24 bg-brown relative overflow-hidden">
        <ThemeDivider
          colorClass="text-[#8C6F5A]"
          position="top"
          type="marshmallow"
        />
        <div
          ref={whyUsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center transition-all duration-1000 ease-out delay-100 ${
            whyUsReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {/* THE WHY US TITLE PILL */}
          <div className="bg-[#A68A77] px-12 md:px-20 py-3 md:py-4 rounded-[2rem] md:rounded-full mb-16 shadow-md drop-shadow-sm">
            <h2
              className="text-4xl md:text-5xl text-[#F4EBD9] tracking-wider select-none"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              Why Us?
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {/* Feature 1 */}
            <div className="bg-[#8C6F5A] p-8 rounded-[2.5rem] text-center hover:-translate-y-3 transition-transform duration-300 shadow-xl relative group border border-white/5">
              <div className="w-16 h-16 mx-auto bg-[#BFA28C] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform text-[#F4EBD9]">
                <FaStar className="text-3xl" />
              </div>
              <h3
                className="text-[#F4EBD9] text-2xl tracking-wide mb-3"
                style={{ fontFamily: "'Knewave', cursive" }}
              >
                Kualitas Premium
              </h3>
              <p className="text-[#F3E4C9] opacity-90 font-medium leading-relaxed">
                Bahan-bahan pilihan terbaik yang menjamin lelehan sempurna dan
                rasa yang tak terlupakan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#8C6F5A] p-8 rounded-[2.5rem] text-center hover:-translate-y-3 transition-transform duration-300 shadow-xl relative group border border-white/5">
              <div className="w-16 h-16 mx-auto bg-[#BFA28C] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform text-[#F4EBD9]">
                <FaFire className="text-3xl" />
              </div>
              <h3
                className="text-[#F4EBD9] text-2xl tracking-wide mb-3"
                style={{ fontFamily: "'Knewave', cursive" }}
              >
                Tanpa Ribet
              </h3>
              <p className="text-[#F3E4C9] opacity-90 font-medium leading-relaxed">
                Nikmati sensasi asyik campfire s'mores kapan saja, tanpa perlu
                repot menyalakan api unggun.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#8C6F5A] p-8 rounded-[2.5rem] text-center hover:-translate-y-3 transition-transform duration-300 shadow-xl relative group border border-white/5">
              <div className="w-16 h-16 mx-auto bg-[#BFA28C] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform text-[#F4EBD9]">
                <FaTags className="text-3xl" />
              </div>
              <h3
                className="text-[#F4EBD9] text-2xl tracking-wide mb-3"
                style={{ fontFamily: "'Knewave', cursive" }}
              >
                Harga Pelajar
              </h3>
              <p className="text-[#F3E4C9] opacity-90 font-medium leading-relaxed">
                Kualitas rasa bintang lima, tapi harga tetap bersahabat dan aman
                di kantong pelajar.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#8C6F5A] p-8 rounded-[2.5rem] text-center hover:-translate-y-3 transition-transform duration-300 shadow-xl relative group border border-white/5">
              <div className="w-16 h-16 mx-auto bg-[#BFA28C] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform text-[#F4EBD9]">
                <FaHeart className="text-3xl" />
              </div>
              <h3
                className="text-[#F4EBD9] text-2xl tracking-wide mb-3"
                style={{ fontFamily: "'Knewave', cursive" }}
              >
                Dibuat Dgn Cinta
              </h3>
              <p className="text-[#F3E4C9] opacity-90 font-medium leading-relaxed">
                Setiap porsi diracik dan disiapkan langsung oleh tangan-tangan
                kreatif tim Smeas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section
        id="products"
        className="py-24 bg-[#8C6F5A] relative overflow-hidden"
      >
        <ThemeDivider
          colorClass="text-[#bea18b]"
          position="top"
          type="cracker"
        />
        <div
          ref={productsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center transition-all duration-1000 ease-out delay-100 ${
            productsReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
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
              <div
                className="text-[#A68A77] font-medium text-2xl"
                style={{ fontFamily: "'Knewave', cursive" }}
              >
                Loading...
              </div>
            ) : products.length === 0 ? (
              <div className="text-[#A68A77] font-medium text-xl">
                No products available right now.
              </div>
            ) : (
              <>
                {/* Left Nav Arrow */}
                <button
                  onClick={prevProduct}
                  disabled={activeIndex === 0}
                  className={`z-30 p-4 md:p-6 rounded-full text-3xl md:text-4xl transition-all duration-300 ${
                    activeIndex === 0
                      ? "bg-white/40 text-[#5C3D2E]/40 cursor-not-allowed shadow-none"
                      : "bg-white text-[#5C3D2E] shadow-xl hover:scale-110"
                  }`}
                >
                  <FaChevronLeft />
                </button>

                {/* The Products Showcase */}
                <div className="relative flex items-center justify-center w-full h-[26rem] md:h-[26rem] overflow-visible">
                  {products.map((product, index) => {
                    const isActive = index === activeIndex;
                    const isPrev = index === activeIndex - 1;
                    const isNext = index === activeIndex + 1;

                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          if (isActive) openModal(product);
                          else if (isPrev || isNext) setActiveIndex(index);
                        }}
                        className={`absolute transition-all duration-700 ease-in-out cursor-pointer flex flex-col items-center justify-center bg-[#A98B76] rounded-[2rem] md:rounded-[3rem] ${
                          isActive
                            ? "w-64 h-[22rem] md:w-80 md:h-[26rem] z-20 scale-100 opacity-100 shadow-xl translate-x-0"
                            : isPrev
                              ? "w-48 h-56 md:w-56 md:h-64 z-10 scale-90 opacity-50 shadow-md -translate-x-36 md:-translate-x-72 hidden sm:flex"
                              : isNext
                                ? "w-48 h-56 md:w-56 md:h-64 z-10 scale-90 opacity-50 shadow-md translate-x-36 md:translate-x-72 hidden sm:flex"
                                : "w-48 h-56 md:w-56 md:h-64 z-0 scale-75 opacity-0 pointer-events-none translate-x-0 hidden sm:flex"
                        }`}
                      >
                        {/* Image Drip built directly into the active card */}
                        {isActive && (
                          <img
                            src="/product-drip.webp"
                            alt="Card Drip"
                            className="absolute -bottom-13 right-[-1] w-10 md:w-14 h-auto pointer-events-none transition-opacity duration-500 delay-200"
                          />
                        )}

                        {/* Product Image popping out the top */}
                        <div
                          className={`absolute ${isActive ? "-top-16 md:-top-24 w-48 md:w-64" : "-top-12 w-36 md:w-48"} drop-shadow-xl transition-all duration-700`}
                        >
                          <img
                            src={`${BACKEND_URL}/storage/products/${product.image}`}
                            alt={product.name}
                            className="w-full h-auto object-contain hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/300?text=Smore";
                            }}
                          />
                        </div>

                        {/* Product Details (Only visible on active card) */}
                        <div
                          className={`mt-20 md:mt-24 flex flex-col items-center transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
                        >
                          <h3
                            className="text-[#F4EBD9] text-2xl md:text-3xl tracking-wider mb-2 text-center px-4"
                            style={{ fontFamily: "'Knewave', cursive" }}
                          >
                            {product.name}
                          </h3>

                          {/* Price */}
                          <div
                            className="text-[#F4EBD9] text-lg md:text-xl tracking-wider mb-6 opacity-90"
                            style={{ fontFamily: "'Knewave', cursive" }}
                          >
                            IDR {Number(product.price).toLocaleString("id-ID")}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(product);
                            }}
                            className="bg-[#EBE0D0] text-[#8C6F5A] px-8 py-2 md:px-10 md:py-3 rounded-full font-bold text-lg hover:brightness-105 transition-colors drop-shadow-md"
                            style={{ fontFamily: "'Knewave', cursive" }}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Nav Arrow */}
                <button
                  onClick={nextProduct}
                  disabled={activeIndex === products.length - 1}
                  className={`z-30 p-4 md:p-6 rounded-full text-3xl md:text-4xl transition-all duration-300 ${
                    activeIndex === products.length - 1
                      ? "bg-white/40 text-[#5C3D2E]/40 cursor-not-allowed shadow-none"
                      : "bg-white text-[#5C3D2E] shadow-xl hover:scale-110"
                  }`}
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 bg-[#4A2E1B] relative overflow-hidden"
      >
        <ThemeDivider
          colorClass="text-[#8C6F5A]"
          position="top"
          type="wave"
          flipHorizontal={true}
        />
        <div
          ref={contactReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center transition-all duration-1000 ease-out delay-100 ${
            contactReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {/* THE CONTACT TITLE PILL */}
          <div className="bg-[#A68A77] px-12 md:px-20 py-3 md:py-4 rounded-[2rem] md:rounded-full mb-16 shadow-md drop-shadow-sm">
            <h2
              className="text-4xl md:text-5xl text-[#F4EBD9] tracking-wider select-none"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              Contact Us
            </h2>
          </div>

          {/* 2-Column Layout: Info on Left, Form on Right */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start w-full max-w-5xl">
            {/* Left Column: Direct Info & Copy */}
            <div className="text-[#F3E8D6]">
              <h3
                className="text-3xl md:text-4xl mb-6 tracking-wide drop-shadow-sm"
                style={{ fontFamily: "'Knewave', cursive" }}
              >
                Sapa Kami!
              </h3>
              <p className="text-lg opacity-90 mb-10 font-medium leading-relaxed">
                Mau pesan dalam jumlah besar untuk acara sekolah, tanya
                ketersediaan stok hari ini, atau sekadar ngobrol soal s'mores?
                Tim Smeas selalu siap membantu!
              </p>

              {/* Contact Details List */}
              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-[#8C6F5A] rounded-full flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="font-black text-lg tracking-wide">
                      Basecamp Kami
                    </p>
                    <p className="opacity-80 font-medium">
                      SMKN 1 Surabaya, Jawa Timur
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-[#8C6F5A] rounded-full flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    <FaClock />
                  </div>
                  <div>
                    <p className="font-black text-lg tracking-wide">
                      Jam Operasional
                    </p>
                    <p className="opacity-80 font-medium">
                      Senin - Jumat | 08:00 - 14:00 WIB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-[#8C6F5A] rounded-full flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    <FaWhatsapp />
                  </div>
                  <div>
                    <p className="font-black text-lg tracking-wide">
                      WhatsApp (Fast Response)
                    </p>
                    <p className="opacity-80 font-medium">+62 859-1839-82879</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: The Form */}
            <div className="bg-[#8C6F5A] p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/10 relative">
              <img
                src="/product-drip.webp"
                alt="Form Drip"
                className="absolute -top-6 -right-4 w-16 h-auto pointer-events-none drop-shadow-sm opacity-80"
              />

              <form
                className="flex flex-col gap-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label className="block text-[#F3E8D6] font-bold mb-2 ml-4 uppercase tracking-wider text-sm">
                    Nama Kamu
                  </label>
                  <input
                    type="text"
                    placeholder="Siapa namamu?"
                    className="w-full bg-[#A68A77]/40 text-[#F3E8D6] placeholder-[#F3E8D6]/60 px-6 py-4 rounded-full outline-none focus:ring-4 focus:ring-[#BFA28C]/50 border border-transparent focus:border-[#F3E8D6]/30 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#F3E8D6] font-bold mb-2 ml-4 uppercase tracking-wider text-sm">
                    WhatsApp / Email
                  </label>
                  <input
                    type="text"
                    placeholder="Biar gampang dihubungin balik..."
                    className="w-full bg-[#A68A77]/40 text-[#F3E8D6] placeholder-[#F3E8D6]/60 px-6 py-4 rounded-full outline-none focus:ring-4 focus:ring-[#BFA28C]/50 border border-transparent focus:border-[#F3E8D6]/30 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#F3E8D6] font-bold mb-2 ml-4 uppercase tracking-wider text-sm">
                    Pesan Manismu
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tulis pesanan, kritik, atau saranmu di sini..."
                    className="w-full bg-[#A68A77]/40 text-[#F3E8D6] placeholder-[#F3E8D6]/60 px-6 py-4 rounded-[2rem] outline-none focus:ring-4 focus:ring-[#BFA28C]/50 border border-transparent focus:border-[#F3E8D6]/30 transition-all resize-none font-medium"
                  ></textarea>
                </div>

                <button
                  className="bg-[#EBE0D0] text-[#8C6F5A] w-full py-4 rounded-full font-black text-2xl hover:brightness-105 hover:scale-[1.02] transition-all drop-shadow-lg mt-4"
                  style={{ fontFamily: "'Knewave', cursive" }}
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODALS --- */}

      {/* Product Detail Modal */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Background Overlay - Fades In/Out */}
          <div
            className={`absolute inset-0 bg-[#F3E8D6]/80 backdrop-blur-sm cursor-pointer transition-opacity duration-300 ease-in-out ${
              isModalOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeModal}
          ></div>

          {/* The Modal Container - Zooms & Slides In/Out */}
          <div
            className={`relative bg-[#A98B76] rounded-[3rem] p-8 md:p-12 w-full max-w-xl max-h-[70vh] shadow-2xl flex flex-col items-center transition-all duration-300 ease-out transform ${
              isModalOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-8"
            }`}
          >
            {/* The bold, round Close Button (Top Right) */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 bg-white text-black text-2xl font-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors drop-shadow-md pb-1"
            >
              x
            </button>

            {/* Modal Drip Asset */}
            <img
              src="/product-drip.webp"
              alt="Modal Drip"
              className="absolute -bottom-14 right-0 w-16 md:w-16 h-auto pointer-events-none"
            />

            {/* Product Image */}
            <div className="w-64 h-64 md:w-80 md:h-80 -mt-24 md:-mt-32 drop-shadow-2xl mb-8">
              <img
                src={`${BACKEND_URL}/storage/products/${modalProduct.image}`}
                alt={modalProduct.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/400?text=Smore";
                }}
              />
            </div>

            {/* Product Title */}
            <h3
              className="text-[#F4EBD9] text-3xl md:text-4xl tracking-wider mb-6 text-center"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              {modalProduct.name}
            </h3>

            {/* Product Description */}
            <p className="text-[#F4EBD9] text-center text-lg md:text-l max-w-2xl leading-relaxed mb-6 font-medium italic">
              "{modalProduct.description}"
            </p>

            {/* Dynamic Stock Indicator */}
            <p className="text-[#F4EBD9]/80 text-center text-sm md:text-base font-bold mb-4 uppercase tracking-widest">
              Available Stock: {modalProduct.stock}
            </p>

            {/* Price Label */}
            <div
              className="text-[#F4EBD9] text-2xl md:text-3xl tracking-wider mb-8 drop-shadow-sm"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              IDR {Number(modalProduct.price).toLocaleString("id-ID")}
            </div>

            {/* Buy Now Button */}
            <button
              className="bg-[#EBE0D0] text-[#8C6F5A] px-12 py-4 rounded-full font-bold text-xl hover:brightness-105 transition-transform hover:scale-105 drop-shadow-md"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              Buy Now
            </button>
          </div>
        </div>
      )}

      {/* Login Popup Modal */}
      {isLoginModalMounted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Background Overlay - Fades In/Out */}
          <div
            className={`absolute inset-0 bg-[#F3E8D6]/80 backdrop-blur-sm cursor-pointer transition-opacity duration-300 ease-in-out ${
              isLoginModalOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeLoginModal}
          ></div>

          {/* The Modal Container - Zooms & Slides In/Out (Adapted from product modal) */}
          <div
            className={`relative bg-[#8d6a54] rounded-t-[3rem] p-8 md:p-12 w-full max-w-xl shadow-2xl flex flex-col items-center transition-all duration-300 ease-out transform ${
              isLoginModalOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-8"
            }`}
          >
            {/* The bold, round Close Button (Top Right) */}
            <button
              onClick={closeLoginModal}
              className="absolute top-6 right-6 bg-white text-black text-2xl font-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors drop-shadow-md pb-1"
            >
              x
            </button>

            {/* drip left */}
            <img
              src="/login-drip-left.webp"
              alt="Login Drip Left"
              className="absolute -bottom-18 left-0 w-20 md:w-20 h-auto pointer-events-none"
            />

            {/* drip right */}
            <img
              src="/login-drip-right.webp"
              alt="Login Drip Right"
              className="absolute -bottom-18 right-0 w-20 md:w-20 h-auto pointer-events-none"
            />

            {/* Form Title */}
            <h3
              className={`text-[#F4EBD9] text-3xl md:text-4xl tracking-wider mb-6 text-center transition-all duration-300 ease-in-out transform ${
                isFormAnimVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              {isRegisterMode ? "Register" : "Login"}
            </h3>

            {/* Login Form */}
            <form
              className={`w-full flex flex-col gap-6 transition-all duration-300 ease-in-out transform ${
                isFormAnimVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
              onSubmit={handleAuthSubmit}
            >
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isRegisterMode
                    ? "grid-rows-[1fr] opacity-100 mb-6"
                    : "grid-rows-[0fr] opacity-0 mb-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden flex flex-col">
                  <label
                    className="block text-[#F4EBD9] font-bold mb-2 ml-4 lowercase tracking-wide text-2xl"
                    style={{ fontFamily: "'Knewave', cursive" }}
                  >
                    Nama:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={authForm.name}
                    onChange={handleAuthInputChange}
                    placeholder="Siapa namamu?"
                    className="w-full bg-[#EBE0D0] text-[#8C6F5A] placeholder-[#8C6F5A]/60 px-6 py-4 rounded-full outline-none focus:ring-4 focus:ring-[#BFA28C]/50 border border-transparent focus:border-[#F3E8D6]/30 transition-all font-medium text-lg"
                    required={isRegisterMode}
                  />
                </div>
              </div>

              {/* --- ADD mb-6 TO EMAIL FIELD --- */}
              <div className="mb-6">
                <label
                  className="block text-[#F4EBD9] font-bold mb-2 ml-4 lowercase tracking-wide text-2xl"
                  style={{ fontFamily: "'Knewave', cursive" }}
                >
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={authForm.email}
                  onChange={handleAuthInputChange}
                  placeholder="Alamat email aktif..."
                  className="w-full bg-[#EBE0D0] text-[#8C6F5A] placeholder-[#8C6F5A]/60 px-6 py-4 rounded-full outline-none focus:ring-4 focus:ring-[#BFA28C]/50 border border-transparent focus:border-[#F3E8D6]/30 transition-all font-medium text-lg"
                  required
                />
              </div>

              {/* --- ADD mb-6 TO PASSWORD FIELD --- */}
              <div className="mb-6">
                <label
                  className="block text-[#F4EBD9] font-bold mb-2 ml-4 lowercase tracking-wide text-2xl"
                  style={{ fontFamily: "'Knewave', cursive" }}
                >
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={authForm.password}
                  onChange={handleAuthInputChange}
                  placeholder="Biar aman diisi passwordnya..."
                  className="w-full bg-[#EBE0D0] text-[#8C6F5A] placeholder-[#8C6F5A]/60 px-6 py-4 rounded-full outline-none focus:ring-4 focus:ring-[#BFA28C]/50 border border-transparent focus:border-[#F3E8D6]/30 transition-all font-medium text-lg"
                  required
                />
              </div>

              {/* Login/Register Button */}
              <button
                type="submit"
                disabled={isAuthLoading}
                className={`bg-[#EBE0D0] text-[#8C6F5A] w-full py-4 rounded-full font-bold text-2xl transition-transform drop-shadow-md mt-4 ${
                  isAuthLoading
                    ? "opacity-70 cursor-wait"
                    : "hover:brightness-105 hover:scale-105"
                }`}
                style={{ fontFamily: "'Knewave', cursive" }}
              >
                {isAuthLoading
                  ? "Memproses..."
                  : isRegisterMode
                    ? "Daftar Sekarang"
                    : "Login"}
              </button>

              {/* Toggle Text */}
              <p className="text-center text-[#F4EBD9] font-medium mt-2">
                {isRegisterMode ? "Sudah punya akun? " : "Belum punya akun? "}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="underline hover:text-white transition-colors"
                >
                  {isRegisterMode ? "Login di sini" : "Daftar di sini"}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* --- FOOTER / TEAM CREDITS & LINKS --- */}
      <footer className="bg-[#A98B76] pt-20 pb-10 text-[#F4EBD9] mt-24 rounded-t-[3rem] md:rounded-t-[5rem] relative overflow-hidden shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl tracking-wider mb-4 drop-shadow-md"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              The Team
            </h2>
            <p className="text-xl opacity-90 font-medium">
              Kelompok 1 - S'mores Smeas / SMK Negeri 1 Surabaya
            </p>
          </div>

          {/* Team Member Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
            {/* Team Member 1 */}
            <div className="bg-[#8C6F5A] p-8 rounded-[2rem] text-center hover:-translate-y-3 transition-transform duration-300 shadow-lg border border-white/10 group">
              <div className="w-16 h-16 mx-auto bg-[#BAC4A2] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <span
                  className="text-[#5C3D2E] font-black text-2xl"
                  style={{ fontFamily: "'Knewave', cursive" }}
                >
                  F
                </span>
              </div>
              <h3 className="font-bold text-xl mb-1">Fakhri Cahyo D.N</h3>
              <p className="text-sm opacity-70 mb-4">Absen: 34</p>
              <div className="inline-block bg-[#EBE0D0] text-[#8C6F5A] text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider drop-shadow-sm">
                UI/UX
              </div>
              <a
                href="https://instagram.com/khrisselll"
                target="_blank"
                rel="noreferrer"
                className="block text-[#F3E8D6] hover:text-white hover:underline transition-colors font-medium"
              >
                @khrisselll
              </a>
            </div>

            {/* Team Member 2 */}
            <div className="bg-[#8C6F5A] p-8 rounded-[2rem] text-center hover:-translate-y-3 transition-transform duration-300 shadow-lg border border-white/10 group">
              <div className="w-16 h-16 mx-auto bg-[#BAC4A2] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <span
                  className="text-[#5C3D2E] font-black text-2xl"
                  style={{ fontFamily: "'Knewave', cursive" }}
                >
                  D
                </span>
              </div>
              <h3 className="font-bold text-xl mb-1">Dava Galang S.</h3>
              <p className="text-sm opacity-70 mb-4">Absen: 23</p>
              <div className="inline-block bg-[#EBE0D0] text-[#8C6F5A] text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider drop-shadow-sm">
                Back End
              </div>
              <a
                href="https://instagram.com/pan_dvpan"
                target="_blank"
                rel="noreferrer"
                className="block text-[#F3E8D6] hover:text-white hover:underline transition-colors font-medium"
              >
                @pan_dvpan
              </a>
            </div>

            {/* Team Member 3 */}
            <div className="bg-[#8C6F5A] p-8 rounded-[2rem] text-center hover:-translate-y-3 transition-transform duration-300 shadow-lg border border-white/10 group">
              <div className="w-16 h-16 mx-auto bg-[#BAC4A2] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <span
                  className="text-[#5C3D2E] font-black text-2xl"
                  style={{ fontFamily: "'Knewave', cursive" }}
                >
                  A
                </span>
              </div>
              <h3 className="font-bold text-xl mb-1">Adis Ibad Basysyr</h3>
              <p className="text-sm opacity-70 mb-4">Absen: 09</p>
              <div className="inline-block bg-[#EBE0D0] text-[#8C6F5A] text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider drop-shadow-sm">
                Laporan
              </div>
              <a
                href="https://instagram.com/kyleebgeenir"
                target="_blank"
                rel="noreferrer"
                className="block text-[#F3E8D6] hover:text-white hover:underline transition-colors font-medium"
              >
                @kyleebgeenir
              </a>
            </div>

            {/* Team Member 4 */}
            <div className="bg-[#8C6F5A] p-8 rounded-[2rem] text-center hover:-translate-y-3 transition-transform duration-300 shadow-lg border border-white/10 group">
              <div className="w-16 h-16 mx-auto bg-[#BAC4A2] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <span
                  className="text-[#5C3D2E] font-black text-2xl"
                  style={{ fontFamily: "'Knewave', cursive" }}
                >
                  G
                </span>
              </div>
              <h3 className="font-bold text-xl mb-1">Gusano Deseda</h3>
              <p className="text-sm opacity-70 mb-4">Absen: 35</p>
              <div className="inline-block bg-[#EBE0D0] text-[#8C6F5A] text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider drop-shadow-sm">
                Front End
              </div>
              <a
                href="https://instagram.com/stallplayz._.101"
                target="_blank"
                rel="noreferrer"
                className="block text-[#F3E8D6] hover:text-white hover:underline transition-colors font-medium"
              >
                @stallplayz._.101
              </a>
            </div>
          </div>

          {/* --- LINKS SECTION --- */}
          <div className="border-t-2 border-[#F4EBD9]/20 pt-16 pb-12 mt-16 flex flex-col lg:flex-row justify-between gap-12">
            {/* Brand & Mission */}
            <div className="lg:w-1/3">
              <h2
                className="text-4xl tracking-wider mb-4 drop-shadow-sm"
                style={{ fontFamily: "'Knewave', cursive" }}
              >
                S'mores Smeas
              </h2>
              <p className="opacity-80 leading-relaxed max-w-sm font-medium">
                Nostalgia in every bite. We bring the ultimate campfire
                experience directly to you, no fire pit required. Perfect for a
                late-night treat or a sweet gift.
              </p>
            </div>

            {/* Sitemap Grid */}
            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Column 1 */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white drop-shadow-sm uppercase tracking-wide">
                  Explore
                </h4>
                <ul className="space-y-4 opacity-80 font-medium">
                  <li>
                    <a
                      href="#home"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#products"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Products
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Why Us?
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 2 */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white drop-shadow-sm uppercase tracking-wide">
                  Company
                </h4>
                <ul className="space-y-4 opacity-80 font-medium">
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Press & Media
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Partnerships
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3 */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white drop-shadow-sm uppercase tracking-wide">
                  Legal
                </h4>
                <ul className="space-y-4 opacity-80 font-medium">
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Refunds
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4 */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white drop-shadow-sm uppercase tracking-wide">
                  Social
                </h4>
                <ul className="space-y-4 opacity-80 font-medium">
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      TikTok
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Twitter / X
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                    >
                      Github
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t-2 border-[#F4EBD9]/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
            <p className="tracking-wide mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} S'mores Smeas Inc. All rights
              reserved.
            </p>
            <p className="font-medium flex items-center gap-2">
              Built with <span className="text-red-400 text-lg">♥</span> for Web
              Programming
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
