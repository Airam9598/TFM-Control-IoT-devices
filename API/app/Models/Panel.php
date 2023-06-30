<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Zone;
use App\Models\User;

class Panel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'own',  'panel_id','user_id')->withPivot('admin', 'history', 'camera','devices','zones','irrigate');
    }

    public function zones()
    {
        return $this->hasMany(Zone::class);
    }
}
