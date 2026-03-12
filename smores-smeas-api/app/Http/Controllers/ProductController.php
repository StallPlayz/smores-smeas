<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $prodcuts = Product::where('stock', '>', 0)->get();

        return response()->json([
            'status' => 'success',
            'data' => $prodcuts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|mimes:jpeg,png,jpg|max:4096',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0'
        ]);

        $image = $request->file('image');

        // Convert image to WebP
        $imagePath = $image->getRealPath();
        $filename = pathinfo($image->hashName(), PATHINFO_FILENAME) . '.webp';
        $destinationPath = storage_path('app/public/products/' . $filename);
        $this->convertToWebP($imagePath, $destinationPath);

        $product = Product::create([
            'image' => $filename, // Store only filename, e.g., 'abc123.webp'
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock
        ]);
        return response()->json([
            'status' => 'success',
            'data' => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'image' => 'nullable|mimes:jpeg,png,jpg|max:4096',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');

            // Convert image to WebP
            $imagePath = $image->getRealPath();
            $filename = pathinfo($image->hashName(), PATHINFO_FILENAME) . '.webp';
            $destinationPath = storage_path('app/public/products/' . $filename);
            $this->convertToWebP($imagePath, $destinationPath);

            // Delete old image
            Storage::disk('public')->delete('products/' . $product->image);

            $product->update([
                'image' => $filename,
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock
            ]);
        } else {
            $product->update([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        Storage::delete('products/' . $product->image);
        $product->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Convert image to WebP format
     */
    private function convertToWebP($sourcePath, $destinationPath)
    {
        // Ensure destination directory exists
        $directory = dirname($destinationPath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        // Convert and save as WebP
        $manager = new ImageManager(new Driver());
        $manager->read($sourcePath)
            ->toWebp(80)
            ->save($destinationPath);
    }
}
