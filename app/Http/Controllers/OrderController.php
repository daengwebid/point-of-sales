<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;

class OrderController extends Controller
{
    public function addOrder()
    {
        $products = Product::orderBy('created_at', 'DESC')->get();
        return view('orders.add', compact('products'));
    }

    public function getProduct($id)
    {
        $products = Product::findOrFail($id);
        return response()->json($products, 200);
    }

    public function addToCart(Request $request)
    {
        $this->validate($request, [
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer'
        ]);
        
        $product = Product::findOrFail($request->product_id);
        $getCart = json_decode($request->cookie('cart'), true);

        if ($getCart) {
            if (array_key_exists($request->product_id, $getCart)) {
                $getCart[$request->product_id]['qty'] += $request->qty;
                return response()->json($getCart, 200)
                    ->cookie('cart', json_encode($getCart), 120);
            } 
        }

        $getCart[$request->product_id] = [
            'code' => $product->code,
            'name' => $product->name,
            'price' => $product->price,
            'qty' => $request->qty
        ];
        return response()->json($getCart, 200)
            ->cookie('cart', json_encode($getCart), 120);
    }

    public function getCart()
    {
        $cart = json_decode(request()->cookie('cart'), true);
        return response()->json($cart, 200);
    }

    public function removeCart($id)
    {
        $cart = json_decode(request()->cookie('cart'), true);
        unset($cart[$id]);
        return response()->json($cart, 200)->cookie('cart', json_encode($cart), 120);
    }

    public function checkout()
    {
        return view('orders.checkout');
    }

    public function buy(Request $request)
    {
        $cart = json_decode($request->cookie('cart'), true);
        return response()->json($cart, 200);
    }
}
