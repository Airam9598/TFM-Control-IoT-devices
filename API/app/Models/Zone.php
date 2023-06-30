<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Panel;
use App\Models\Device;

class Zone extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name',
        'country',
        'lat',
        'lng',
        'lat',
        'max_soil_moisture',
        'min_soil_moisture',
        'max_soil_temp',
        'min_soil_temp',
        'min_air_temp',
        'max_air_temp',
        'panel_id'
    ];

    public function panels(){
        return $this->belongsTo(Panel::class, 'panel_id');
    }

    public function devices()
    {
        return $this->hasMany(Device::class);
    }

}
