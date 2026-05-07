<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// ====== PUBLIC ROUTES ======
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Customers can view products and send messages
Route::apiResource('/products', ProductController::class)->only(['index', 'show']);
Route::apiResource('/messages', MessageController::class)->only(['store']);
Route::post('/orders', [OrderController::class, 'store']);

// ====== PROTECTED ADMIN ROUTES ======
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // User Management
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Product Management (Create, Update, Delete)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Order Management & Analytics
    Route::get('/orders/analytics', [OrderController::class, 'analytics']);
    Route::apiResource('/orders', OrderController::class)->only(['index', 'show']);

    // Read Messages
    Route::apiResource('/messages', MessageController::class)->only(['index', 'show', 'destroy']);
});
