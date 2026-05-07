<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::latest()->get();
        return response()->json(['data' => $users]);
    }

    public function updateRole(Request $request, string $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'role' => 'required|in:user,admin'
        ]);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id && $validated['role'] === 'user') {
            return response()->json(['message' => 'Tidak bisa mengubah role akunmu sendiri.'], 400);
        }

        $user->role = $validated['role'];
        $user->save();

        return response()->json(['status' => 'success', 'data' => $user]);
    }

    public function destroy(Request $request, string $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Tidak bisa menghapus akunmu sendiri.'], 400);
        }

        $user->delete();

        return response()->json(['status' => 'success', 'message' => 'Akun berhasil dihapus.']);
    }
}
