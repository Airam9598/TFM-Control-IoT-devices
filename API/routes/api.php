<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ZoneController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PanelController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TypeController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('login',[AuthController::class,'loginUser'])->name('login');
Route::post('/users', [UserController::class,'store']);
Route::post('/devices/{device_id}', [DeviceController::class,'updateMongo']);

Route::group(['middleware' => 'auth:sanctum'],function(){

    Route::get('/me', [AuthController::class,'userDetails']);
    Route::get('/logout', [AuthController::class,'logout']);
    Route::get('/types', [TypeController::class,'index']);

    Route::get('/panels', [PanelController::class,'index']);
    Route::get('/panels/{id}', [PanelController::class,'show']);
    Route::post('/panels', [PanelController::class,'store']);
    Route::patch('/panels/{id}',[PanelController::class,'update']);
    Route::delete('/panels/{id}',[PanelController::class,'destroy']);


    Route::get('/panels/{id}/users', [UserController::class,'index']);
    Route::get('/panels/{id}/users/{id_user}', [UserController::class,'show']);
    Route::post('/panels/{id}/users', [UserController::class,'store']);
    Route::patch('/panels/{id}/users/{id_user}',[UserController::class,'update']);
    Route::patch('/users',[UserController::class,'update']);
    Route::delete('/panels/{id}/users/{id_user}',[UserController::class,'destroy']);
    Route::delete('/users',[UserController::class,'destroy']);

    Route::get('/panels/{id}/zones', [ZoneController::class,'index']);
    Route::post('/panels/{id}/zones/{id_zone}-irrigate', [ZoneController::class,'irrigate']);
    Route::get('/panels/{id}/{device}', [ZoneController::class,'index']);
    Route::get('/panels/{id}/zones/{id_zone}', [ZoneController::class,'show']);
    Route::post('/panels/{id}/zones', [ZoneController::class,'store']);
    Route::patch('/panels/{id}/zones/{id_zone}',[ZoneController::class,'update']);
    Route::delete('/panels/{id}/zones/{id_zone}',[ZoneController::class,'destroy']);

    Route::get('/panels/{id}/zones/{id_zone}/devices', [DeviceController::class,'index']);
    Route::get('/panels/{id}/zones/{id_zone}/devices-{info}/', [DeviceController::class,'index']);
    Route::get('/panels/{id}/zones/{id_zone}/devices/{device_id}', [DeviceController::class,'show']);
    Route::get('/panels/{id}/zones/{id_zone}/devices/{device_id}/{info}', [DeviceController::class,'show']);
    Route::get('/panels/{id}/zones/{id_zone}/devices/{device_id}', [DeviceController::class,'show']);
    Route::post('/panels/{id}/zones/{id_zone}/devices', [DeviceController::class,'store']);
    Route::patch('/panels/{id}/zones/{id_zone}/devices/{device_id}',[DeviceController::class,'update']);
    Route::patch('/panels/{id}/zones/{id_zone}/devices/{device_id}/irrigate',[DeviceController::class,'irrigate']);
    Route::delete('/panels/{id}/zones/{id_zone}/devices/{device_id}',[DeviceController::class,'destroy']);

});


