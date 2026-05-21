<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource with product and user data.
     */
    public function index()
    {
        // We use 'with' to load the product and user data in the same query
        $orders = Order::with(['product', 'user'])->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'message' => 'nullable|string',
            'guest_name' => 'nullable|string|max:255',
            'guest_phone' => 'nullable|string|max:20',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Stok produk tidak mencukupi.'], 400);
        }

        $total_price = $product->price * $request->quantity;
        $isLoggedIn = auth('sanctum')->check();

        $order = Order::create([
            'user_id' => $isLoggedIn ? auth('sanctum')->id() : null,
            'product_id' => $product->id,
            'guest_name' => $isLoggedIn ? null : $request->guest_name,
            'guest_phone' => $isLoggedIn ? null : $request->guest_phone,
            'quantity' => $request->quantity,
            'message' => $request->message,
            'total_price' => $total_price,
            'status' => 'pending',
        ]);

        $product->decrement('stock', $request->quantity);

        return response()->json(['status' => 'success', 'data' => $order], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $order
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
