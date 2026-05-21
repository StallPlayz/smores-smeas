"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaChartPie,
  FaBoxOpen,
  FaUserCog,
  FaSignOutAlt,
  FaUserCircle,
  FaTrashAlt,
  FaExchangeAlt,
  FaShoppingBag,
  FaEdit,
} from "react-icons/fa";
import Swal from "sweetalert2";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// --- TYPES ---
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  stock: number;
}

interface OrderData {
  id: number;
  unique_id: string;
  guest_name: string | null;
  user: { name: string } | null;
  product: { name: string } | null;
  quantity: number;
  status: string;
  total_price: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState("dashboard");

  // --- DATA STATES ---
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // --- PRODUCT MODAL STATES ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- TOAST STATE ---
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      router.push("/");
      return;
    }
    setUser(parsedUser);
    setIsAuthorized(true);
  }, [router]);

  // --- DATA FETCHING ---
  const fetchDashboardData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/orders/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTotalOrders(data.total_orders || 0);
        setTotalRevenue(data.total_revenue || 0);
        setRecentOrders(data.recent_orders || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (res.ok && data.data) setUsersList(data.data);
    } catch (error) {
      console.error(error);
      showToast("Gagal mengambil data user.", "error");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/products`);
      const data = await res.json();
      if (res.ok) {
        if (data.data && Array.isArray(data.data)) setProductsList(data.data);
        else if (Array.isArray(data)) setProductsList(data);
      }
    } catch (error) {
      console.error(error);
      showToast("Gagal mengambil data produk.", "error");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;
    if (activeTab === "dashboard") fetchDashboardData();
    if (activeTab === "admins") fetchUsers();
    if (activeTab === "products") fetchProducts();
  }, [activeTab, isAuthorized, fetchDashboardData, fetchUsers, fetchProducts]);

  // --- ACTION HANDLERS ---
  const handleRoleChange = async (targetId: number, currentRole: string) => {
    if (!confirm("Yakin ingin mengubah role user ini?")) return;
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/users/${targetId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast("Role berhasil diubah!", "success");
        fetchUsers();
      } else {
        showToast(data.message || "Gagal mengubah role.", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan jaringan.", "error");
    }
  };

  const handleDeleteUser = async (targetId: number) => {
    if (!confirm("PERINGATAN: Yakin ingin menghapus user ini secara permanen?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/users/${targetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        showToast("User berhasil dihapus.", "success");
        fetchUsers();
      } else {
        showToast(data.message || "Gagal menghapus user.", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan jaringan.", "error");
    }
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || "",
        price: product.price,
        stock: product.stock.toString(),
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: "", description: "", price: "", stock: "" });
    }
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProduct(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("price", productForm.price);
    formData.append("stock", productForm.stock);
    if (selectedImage) formData.append("image", selectedImage);

    let url = `${BACKEND_URL}/api/products`;
    if (editingProduct) {
      url = `${BACKEND_URL}/api/products/${editingProduct.id}`;
      formData.append("_method", "PUT");
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (res.ok) {
        showToast(
          editingProduct ? "Produk berhasil diupdate!" : "Produk ditambahkan!",
          "success",
        );
        setIsProductModalOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        showToast(data.message || "Gagal menyimpan produk.", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan jaringan.", "error");
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F3E8D6] flex items-center justify-center">
        <p className="text-[#8C6F5A] font-bold text-xl animate-pulse">
          Memverifikasi akses...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3E8D6] flex font-sans relative overflow-hidden">
      {/* --- TOAST NOTIFICATION --- */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"}`}
      >
        <div
          className={`px-8 py-4 rounded-full font-bold text-white shadow-xl flex items-center gap-3 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#4A2E1B] text-[#F4EBD9] flex flex-col justify-between shadow-2xl z-20 shrink-0">
        <div>
          <div className="p-8 pb-12 flex flex-col items-center border-b border-[#F4EBD9]/10">
            <h2
              className="text-3xl text-center tracking-wider text-[#F4EBD9]"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              S'mores Admin
            </h2>
          </div>
          <nav className="flex flex-col gap-2 p-4 mt-4 font-medium text-lg">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-4 px-6 py-4 rounded-full transition-all ${activeTab === "dashboard" ? "bg-[#8C6F5A] text-white shadow-md" : "hover:bg-[#5C3D2E] text-[#EBE0D0]"}`}
            >
              <FaChartPie className="text-xl" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-4 px-6 py-4 rounded-full transition-all ${activeTab === "products" ? "bg-[#8C6F5A] text-white shadow-md" : "hover:bg-[#5C3D2E] text-[#EBE0D0]"}`}
            >
              <FaBoxOpen className="text-xl" /> Edit Product
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`flex items-center gap-4 px-6 py-4 rounded-full transition-all ${activeTab === "admins" ? "bg-[#8C6F5A] text-white shadow-md" : "hover:bg-[#5C3D2E] text-[#EBE0D0]"}`}
            >
              <FaUserCog className="text-xl" /> Account Center
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-[#F4EBD9]/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 w-full rounded-full transition-all hover:bg-red-800 text-[#EBE0D0] hover:text-white font-medium text-lg"
          >
            <FaSignOutAlt className="text-xl" /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="flex justify-between items-center p-8 bg-[#F3E8D6] sticky top-0 z-10 shrink-0">
          <h1
            className="text-4xl text-[#4A2E1B] tracking-wider capitalize"
            style={{ fontFamily: "'Knewave', cursive" }}
          >
            {activeTab.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-4 bg-[#EBE0D0] px-6 py-3 rounded-full shadow-sm border border-[#BFA28C]/30">
            <FaUserCircle className="text-3xl text-[#8C6F5A]" />
            <div>
              <p className="text-[#4A2E1B] font-bold leading-tight">
                {user?.name}
              </p>
              <p className="text-[#8C6F5A] text-sm font-medium leading-tight capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </header>

        <div className="p-8 pt-4 flex flex-col gap-8">
          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#8C6F5A] rounded-[2rem] p-8 flex items-center justify-between shadow-lg relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[#F4EBD9]/80 font-bold text-xl mb-1">
                      Total Penjualan
                    </p>
                    <p
                      className="text-5xl font-black text-white"
                      style={{ fontFamily: "'Knewave', cursive" }}
                    >
                      {isLoadingData ? "..." : totalOrders}
                    </p>
                  </div>
                  <FaBoxOpen className="text-7xl text-[#F4EBD9]/20 absolute right-6 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-[#4A2E1B] rounded-[2rem] p-8 flex items-center justify-between shadow-lg relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[#F4EBD9]/80 font-bold text-xl mb-1">
                      Total Revenue
                    </p>
                    <p
                      className="text-4xl md:text-5xl font-black text-white tracking-wide"
                      style={{ fontFamily: "'Knewave', cursive" }}
                    >
                      {isLoadingData
                        ? "..."
                        : `Rp ${totalRevenue.toLocaleString("id-ID")}`}
                    </p>
                  </div>
                  <FaShoppingBag className="text-7xl text-[#F4EBD9]/20 absolute right-6 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="bg-[#EBE0D0] rounded-[2rem] p-8 shadow-md border border-[#BFA28C]/30 flex flex-col h-[500px]">
                <h3
                  className="text-2xl font-bold text-[#4A2E1B] mb-6"
                  style={{ fontFamily: "'Knewave', cursive" }}
                >
                  Pesanan Terbaru
                </h3>
                <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#8C6F5A] border-b-2 border-[#8C6F5A]/20">
                        <th className="pb-4 font-bold">Order ID</th>
                        <th className="pb-4 font-bold">Customer</th>
                        <th className="pb-4 font-bold">Item</th>
                        <th className="pb-4 font-bold text-center">Status</th>
                        <th className="pb-4 font-bold text-right">
                          Total Harga
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[#4A2E1B] font-medium">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-[#8C6F5A]/10 hover:bg-[#F3E8D6] transition-colors"
                          >
                            <td className="py-4">
                              #{order.unique_id || order.id}
                            </td>

                            {/* Dynamically fallback to guest_name if user is null */}
                            <td className="py-4">
                              {order.guest_name || order.user?.name || "Guest"}
                            </td>

                            {/* Display Quantity x Product Name */}
                            <td className="py-4">
                              {order.quantity}x{" "}
                              {order.product?.name || "Produk Dihapus"}
                            </td>

                            <td className="py-4 text-center">
                              <span
                                className={`py-1 px-3 rounded-full text-sm font-bold ${order.status === "completed" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}
                              >
                                {order.status.toUpperCase()}
                              </span>
                            </td>

                            <td className="py-4 text-right">
                              Rp {order.total_price.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-8 text-center text-[#8C6F5A]"
                          >
                            Belum ada pesanan masuk.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* EDIT PRODUCT TAB */}
          {activeTab === "products" && (
            <div className="bg-[#EBE0D0] rounded-[2rem] p-8 shadow-md border border-[#BFA28C]/30 flex flex-col h-[600px]">
              <div className="flex justify-between items-center mb-6">
                <h3
                  className="text-2xl font-bold text-[#4A2E1B]"
                  style={{ fontFamily: "'Knewave', cursive" }}
                >
                  Daftar Produk
                </h3>
                <button
                  onClick={() => openProductModal()}
                  className="bg-[#8C6F5A] text-white px-6 py-2 rounded-full font-bold hover:bg-[#5C3D2E] transition-colors shadow-sm"
                >
                  + Tambah Produk
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {isLoadingData ? (
                  <p className="text-center text-[#8C6F5A] font-bold py-10 animate-pulse">
                    Memuat Data...
                  </p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#8C6F5A] border-b-2 border-[#8C6F5A]/20">
                        <th className="pb-4 font-bold w-16">Image</th>
                        <th className="pb-4 font-bold">Nama Product</th>
                        <th className="pb-4 font-bold text-center">Stok</th>
                        <th className="pb-4 font-bold text-right">Harga</th>
                        <th className="pb-4 font-bold text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#4A2E1B] font-medium">
                      {productsList.map((prod) => (
                        <tr
                          key={prod.id}
                          className="border-b border-[#8C6F5A]/10 hover:bg-[#F3E8D6] transition-colors"
                        >
                          <td className="py-3">
                            <div className="w-12 h-12 bg-gray-300 rounded-xl overflow-hidden">
                              <img
                                src={`${BACKEND_URL}/storage/products/${prod.image}`}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-3">{prod.name}</td>
                          <td className="py-3 text-center">{prod.stock}</td>
                          <td className="py-3 text-right">
                            Rp {parseInt(prod.price).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => openProductModal(prod)}
                              className="text-[#8C6F5A] hover:text-[#4A2E1B] p-2 rounded-full hover:bg-[#8C6F5A]/10 transition-colors"
                            >
                              <FaEdit size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ACCOUNT CENTER TAB */}
          {activeTab === "admins" && (
            <div className="bg-[#EBE0D0] rounded-[2rem] p-8 shadow-md border border-[#BFA28C]/30 flex flex-col h-[600px]">
              <h3
                className="text-2xl font-bold text-[#4A2E1B] mb-6"
                style={{ fontFamily: "'Knewave', cursive" }}
              >
                Account Center
              </h3>
              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {isLoadingData ? (
                  <p className="text-center text-[#8C6F5A] font-bold py-10 animate-pulse">
                    Memuat Data...
                  </p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#8C6F5A] border-b-2 border-[#8C6F5A]/20">
                        <th className="pb-4 font-bold">Nama</th>
                        <th className="pb-4 font-bold">Email</th>
                        <th className="pb-4 font-bold text-center">Role</th>
                        <th className="pb-4 font-bold text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#4A2E1B] font-medium">
                      {usersList.map((u) => (
                        <tr
                          key={u.id}
                          className="border-b border-[#8C6F5A]/10 hover:bg-[#F3E8D6] transition-colors"
                        >
                          <td className="py-4">
                            {u.name}{" "}
                            {user?.id === u.id && (
                              <span className="text-xs ml-2 bg-[#8C6F5A] text-white px-2 py-1 rounded-full">
                                (Anda)
                              </span>
                            )}
                          </td>
                          <td className="py-4">{u.email}</td>
                          <td className="py-4 text-center">
                            <span
                              className={`py-1 px-3 rounded-full text-sm font-bold ${u.role === "admin" ? "bg-purple-200 text-purple-800" : "bg-gray-200 text-gray-800"}`}
                            >
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 text-center flex justify-center gap-3">
                            <button
                              onClick={() => handleRoleChange(u.id, u.role)}
                              disabled={u.id === user?.id}
                              className={`p-2 rounded-full transition-colors ${u.id === user?.id ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-100"}`}
                              title="Ubah Role"
                            >
                              <FaExchangeAlt />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.id === user?.id}
                              className={`p-2 rounded-full transition-colors ${u.id === user?.id ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:bg-red-100"}`}
                              title="Hapus User"
                            >
                              <FaTrashAlt />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsProductModalOpen(false)}
          ></div>
          <div className="relative bg-[#F3E8D6] rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl z-10">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-6 right-6 text-[#8C6F5A] hover:text-[#4A2E1B] font-black text-xl"
            >
              X
            </button>
            <h3
              className="text-[#4A2E1B] text-3xl mb-6 text-center"
              style={{ fontFamily: "'Knewave', cursive" }}
            >
              {editingProduct ? "Edit Produk" : "Tambah Produk"}
            </h3>

            <form
              onSubmit={handleProductSubmit}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8C6F5A] font-bold mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white border border-[#BFA28C]/50 outline-none focus:ring-2 focus:ring-[#8C6F5A]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C6F5A] font-bold mb-1">
                    Stok
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-white border border-[#BFA28C]/50 outline-none focus:ring-2 focus:ring-[#8C6F5A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8C6F5A] font-bold mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#BFA28C]/50 outline-none focus:ring-2 focus:ring-[#8C6F5A]"
                />
              </div>

              <div>
                <label className="block text-[#8C6F5A] font-bold mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#BFA28C]/50 outline-none focus:ring-2 focus:ring-[#8C6F5A] resize-none"
                />
              </div>

              <div>
                <label className="block text-[#8C6F5A] font-bold mb-1">
                  Gambar Produk {editingProduct && "(Opsional)"}
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  ref={fileInputRef}
                  required={!editingProduct}
                  onChange={(e) =>
                    setSelectedImage(e.target.files ? e.target.files[0] : null)
                  }
                  className="w-full text-[#8C6F5A] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#8C6F5A] file:text-white hover:file:bg-[#5C3D2E] transition-colors cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingProduct}
                className={`mt-4 w-full py-4 rounded-full font-bold text-xl text-white transition-colors ${isSubmittingProduct ? "bg-gray-400 cursor-wait" : "bg-[#4A2E1B] hover:bg-[#8C6F5A]"}`}
                style={{ fontFamily: "'Knewave', cursive" }}
              >
                {isSubmittingProduct ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
