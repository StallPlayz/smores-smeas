<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;

Route::get('/products', action: [ProductController::class, 'index']);
Route::post('/checkout', [OrderController::class, 'store']);
