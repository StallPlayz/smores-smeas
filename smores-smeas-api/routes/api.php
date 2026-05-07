<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});

// Resources
Route::apiResource('/products', ProductController::class);
Route::apiResource('/products', ProductController::class)->middleware('auth:sanctum')->only(['store', 'update', 'destroy']);

Route::apiResource('/messages', MessageController::class);
Route::apiResource('/messages', MessageController::class)->middleware('auth:sanctum')->only(['index', 'destroy', 'update']);
