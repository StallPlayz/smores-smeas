<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

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

    public function show(string $id)
    {
        $product = Product::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    public function store(Request $request)
    {
        try {
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

        } catch (ValidationException $e) {
            return response()->json([
                'message' => collect($e->errors())->flatten()->first()
            ], 422);
        } catch (Throwable $th) {
            return response()->json([
                'message' => 'PHP Error: ' . $th->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
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

        } catch (ValidationException $e) {
            return response()->json([
                'message' => collect($e->errors())->flatten()->first()
            ], 422);
        } catch (Throwable $th) {
            return response()->json([
                'message' => 'PHP Error: ' . $th->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $product = Product::findOrFail($id);

            if ($product->image) {
                Storage::delete('public/products/' . $product->image);
            }

            $product->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Produk berhasil dihapus.'
            ]);
        } catch (Throwable $th) {
            return response()->json([
                'message' => 'PHP Error: ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * Native PHP WebP Converter with Safety Checks
     */
    private function convertToWebP($file, $destinationPath)
    {
        if (!extension_loaded('gd')) {
            throw new \Exception('Ekstensi PHP GD tidak terinstal di server ini.');
        }
        if (!function_exists('imagewebp')) {
            throw new \Exception('Dukungan WebP tidak diaktifkan di server PHP ini.');
        }

        $directory = dirname($destinationPath);
        if (!is_dir($directory)) {
            // Force create directory recursively
            if (!mkdir($directory, 0755, true)) {
                throw new \Exception('Gagal membuat folder penyimpanan gambar di server.');
            }
        }

        $sourcePath = $file->getRealPath();
        if (!$sourcePath) {
            throw new \Exception('Gagal membaca file gambar sementara. File mungkin terlalu besar.');
        }

        $mimeType = $file->getMimeType();

        switch ($mimeType) {
            case 'image/jpeg':
            case 'image/jpg':
                $image = @imagecreatefromjpeg($sourcePath);
                break;
            case 'image/png':
                $image = @imagecreatefrompng($sourcePath);
                if ($image) {
                    // Preserve transparency for PNGs
                    imagepalettetotruecolor($image);
                    imagealphablending($image, true);
                    imagesavealpha($image, true);
                }
                break;
            case 'image/webp':
                if (!copy($sourcePath, $destinationPath)) {
                    throw new \Exception('Gagal menyalin file gambar WebP.');
                }
                return;
            default:
                throw new \Exception('Format gambar tidak didukung: ' . $mimeType);
        }

        if (!$image) {
            throw new \Exception('Gagal membaca pixel gambar. File mungkin rusak atau tidak valid.');
        }

        // Save as WebP with 80% quality
        if (!imagewebp($image, $destinationPath, 80)) {
            imagedestroy($image);
            throw new \Exception('Proses konversi ke WebP gagal di sisi server.');
        }

        imagedestroy($image);
    }
}
