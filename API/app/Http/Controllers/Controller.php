<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Stmt\Foreach_;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected $user;
    protected $panel;
    protected $zone;

    protected $device;
    protected $error;

    public function __construct() {
        $this->databaseConfig();
    }

    protected function databaseConfig(){
        Config::set('database.default', 'mysql');
       return $this->user = Auth::user();
    }

    protected function getPanel(String $id){
       $this->panel = $this->user->panels()->find($id);
       if(!$this->panel){
        $this->error= $this->errorResult(trans('validation.custom.exist',['attribute' => 'El panel', 'error']),401);
        throw new Exception();
       }
    }

    protected function getZone($zone_id){
        $this->zone = $this->panel->zones()->find($zone_id);
        if(!$this->zone){
            $this->error=trans('validation.custom.exist',['attribute' => 'La zona', 'error']);
            throw new Exception();
        }
    }

    protected function getDevice($device_id){
        $this->device = $this->zone->devices()->with('zone', 'types')->find($device_id);
        if(!$this->device){
            $this->error=trans('validation.custom.exist',['attribute' => 'El dispositivo', 'error']);
            throw new Exception();
        }
    }

    protected function validate($info,$validator){
        $validator = Validator::make($info, $validator);
        if ($validator->fails()) {
            $this->error= $this->errorResult($validator->errors(),401);
            throw new Exception();
        }
    }

    protected function filter($elem, $filters,$request, $method=null){
        $query = $request->input('q');
        if($query){
            $index=[
                'like' => '%'.$query.'%',
            ];
            if($method=="OR"){
                foreach($filters as $filterKey=>$filterValue){
                    $elem->orWhere($filterKey, $filterValue, $index[$filterValue] ?? $query);
                }
            }else{
                foreach($filters as $filterKey=>$filterValue){
                    $elem->where($filterKey, $filterValue, $index[$filterValue] ?? $query);
                }
            }

        }
        return $elem;
    }

    protected function correctResult($info){
        return response()->json(['success' => true, 'data' => $info], 200);
    }

    protected function errorResult($info,$type){
        return response()->json(['success' => false, 'error' => $info], $type);
    }

    protected function PermissionChecker($perms){
        $error=true;

        foreach($perms as $perm){
            if ($this->panel->pivot->$perm) {
                $error=false;
            }
        }
        if($error){
            $this->error= $this->errorResult('No tienes permisos',550);
            throw new Exception();
        }
        return true;
    }
}
