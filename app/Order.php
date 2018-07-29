<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $guarded = [];
    
    public function order_detail()
    {
        return $this->hasMany(Order_detail::class);
    }
}
