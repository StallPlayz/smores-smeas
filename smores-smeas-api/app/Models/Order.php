<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'guest_name',
        'guest_phone',
        'quantity',
        'message',
        'total_price',
        'status',
        'unique_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Boot function dari Laravel Eloquent.
     * Digunakan untuk menghandle logic otomatis saat event tertentu terjadi.
     */
    protected static function booted()
    {
        static::creating(function ($order) {
            // Mengisi unique_id secara otomatis sebelum data disimpan
            $order->unique_id = self::generateUniqueId();
        });
    }

    /**
     * Logic untuk membuat Unique ID dengan 3 digit terakhir.
     * Format: ORD-YYYYMMDD-001
     */
    public static function generateUniqueId()
    {
        $datePart = date('Ymd'); // Contoh: 20260507
        $prefix = 'ORD-' . $datePart . '-';

        // Ambil record terakhir yang dibuat hari ini
        $lastOrder = self::withoutGlobalScopes()
                         ->where('unique_id', 'LIKE', $prefix . '%')
                         ->orderBy('unique_id', 'desc')
                         ->first();

        if (!$lastOrder) {
            // Jika belum ada order hari ini, mulai dari 1
            $nextNumber = 1;
        } else {
            // Ambil 3 digit terakhir dari unique_id terakhir, lalu tambah 1
            $lastIncrement = substr($lastOrder->unique_id, -3);
            $nextNumber = (int)$lastIncrement + 1;
        }

        // Gabungkan prefix dengan angka yang sudah di-format menjadi 3 digit
        return $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}

