<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;
use App\Customer;
use App\Order;
use App\User;
use Carbon\Carbon;
use DB;

class HomeController extends Controller
{
    public function index()
    {
        $product = Product::count();
        $order = Order::count();
        $customer = Customer::count();
        $user = User::count();
        return view('home', compact('product', 'order', 'customer', 'user'));
    }

    public function getChart()
    {
        $start = Carbon::now()->subWeek()->addDay()->format('Y-m-d') . ' 00:00:01';
        $end = Carbon::now()->format('Y-m-d') . ' 23:59:00';
        
        $order = Order::select(DB::raw('date(created_at) as order_date'), DB::raw('count(*) as total_order'))
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('created_at')    
            ->get()->pluck('total_order', 'order_date')->all();

        for ($i = Carbon::now()->subWeek()->addDay(); $i <= Carbon::now(); $i->addDay()) {
            if (array_key_exists($i->format('Y-m-d'), $order)) {
                $data[$i->format('Y-m-d')] = $order[$i->format('Y-m-d')];
            } else {
                $data[$i->format('Y-m-d')] = 0;
            }
        }
        return response()->json($data);
    }
}
