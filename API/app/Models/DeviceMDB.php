<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class DeviceMDB extends Model
{
    protected $connection = 'mongodb'; // Especifica la conexión de MongoDB que deseas utilizar
    protected $collection = 'device'; // Especifica el nombre de la colección de MongoDB
    protected $primaryKey = '_id';
    protected $keyType = 'string';

    protected $fillable = [
        'data'
    ];

    protected $rules = [
        'data' => 'required',
        'data' => 'array',
    ];

}
