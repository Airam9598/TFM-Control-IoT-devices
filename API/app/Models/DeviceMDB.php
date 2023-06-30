<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class DeviceMDB extends Model
{
    protected $connection = 'mongodb'; // Especifica la conexión de MongoDB que deseas utilizar
    protected $collection = 'device'; // Especifica el nombre de la colección de MongoDB
    protected $primaryKey = '_id';
    protected $keyType = 'string';
    // Define los campos que se pueden llenar en el modelo (opcional)
    protected $fillable = [
        'data'
        // Otros campos
    ];

    // Define las reglas de validación para los campos (opcional)
    protected $rules = [
        'data' => 'required',
        'data' => 'array',
        // Otros campos y reglas de validación
    ];

    // Define las relaciones con otros modelos (opcional)
    // ...

    // Define otros métodos y funcionalidades del modelo
    // ...
}