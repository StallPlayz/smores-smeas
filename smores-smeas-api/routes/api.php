<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ====== PUBLIC ROUTES ======

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// Public product listing
Route::apiResource('/products', ProductController::class)->only(['index', 'show']);
Route::apiResource('/messages', MessageController::class)->only('store');
Route::apiResource('/orders', OrderController::class)->only('store');

// ====== ADMIN ROUTES ======

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Product management
    Route::apiResource('/products', ProductController::class)->only(['store', 'update', 'destroy']);


    // Message management
    Route::apiResource('/messages', MessageController::class)->only(['index', 'show']);


    // Order management
    Route::apiResource('/orders', OrderController::class)->only(['index', 'show']);


});
