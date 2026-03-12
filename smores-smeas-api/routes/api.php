<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// Resources
Route::apiResource('/products', ProductController::class);
Route::apiResource('/products', ProductController::class)->middleware('auth:sanctum')->only(['store', 'update', 'destroy']);

Route::apiResource('/messages', MessageController::class);
Route::apiResource('/messages', MessageController::class)->middleware('auth:sanctum')->only(['index', 'destroy', 'update']);
