<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0'
        ]);

        $image = $request->file('image');
        $filename = pathinfo($image->hashName(), PATHINFO_FILENAME) . '.webp';
        $destinationPath = storage_path('app/public/products/' . $filename);

        $this->convertToWebP($image, $destinationPath);

        $product = Product::create([
            'image' => $filename,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock
        ]);

        return response()->json(['status' => 'success', 'data' => $product], 201);
    }

    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0'
        ]);

        $dataToUpdate = [
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock
        ];

        if ($request->hasFile('image')) {
            // Remove the old image
            if ($product->image) {
                Storage::delete('public/products/' . $product->image);
            }

            // Process the new image
            $image = $request->file('image');
            $filename = pathinfo($image->hashName(), PATHINFO_FILENAME) . '.webp';
            $destinationPath = storage_path('app/public/products/' . $filename);

            $this->convertToWebP($image, $destinationPath);
            $dataToUpdate['image'] = $filename;
        }

        $product->update($dataToUpdate);

        return response()->json(['status' => 'success', 'data' => $product]);
    }

    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            Storage::delete('public/products/' . $product->image);
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Produk berhasil dihapus.'
        ]);
    }

    /**
     * Native PHP WebP Converter (No External Packages Required)
     */
    private function convertToWebP($file, $destinationPath)
    {
        $directory = dirname($destinationPath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $sourcePath = $file->getRealPath();
        $mimeType = $file->getMimeType();

        switch ($mimeType) {
            case 'image/jpeg':
            case 'image/jpg':
                $image = imagecreatefromjpeg($sourcePath);
                break;
            case 'image/png':
                $image = imagecreatefrompng($sourcePath);
                // Preserve transparency for PNGs
                imagepalettetotruecolor($image);
                imagealphablending($image, true);
                imagesavealpha($image, true);
                break;
            case 'image/webp':
                // If it is already a WebP, just copy it directly
                copy($sourcePath, $destinationPath);
                return;
            default:
                throw new \Exception('Format gambar tidak didukung.');
        }

        // Save as WebP with 80% quality
        imagewebp($image, $destinationPath, 80);
        imagedestroy($image);
    }
}
