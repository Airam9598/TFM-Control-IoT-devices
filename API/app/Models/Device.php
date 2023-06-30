<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Zone;
use App\Models\Type;

class Device extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $dates = ['deleted_at'];
    protected $fillable = [
        'name',
        'data_id',
        'zone_id',
        'dev_id',
    ];

    public function zone(){
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    public function types()
    {
        return $this->belongsToMany(Type::class, 'detect', 'dev_id', 'type_id');
    }
}
