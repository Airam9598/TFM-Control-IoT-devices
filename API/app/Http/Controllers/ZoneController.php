<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use App\Models\Zone;
use Illuminate\Http\Request;
use App\Models\DeviceMDB;

class ZoneController extends Controller
{
    private function databaseConfig(){
        Config::set('database.default', 'mysql');
        return $user = Auth::user();
    }

    private function getPanel(String $id){
        $user=$this->databaseConfig();
        $panel = $user->panels()->find($id);
        return $panel;
    }
    

    public function index(Request $request,String $id, $device=null)
    {
        $user=$this->databaseConfig();
        $query = $request->input('q');
        if($query!=null){
            $panel=$this->getPanel($id);
            if($panel != null){
                $zone = $panel->zones()->get()->where('name', 'like', '%'.$query.'%');
            }else{
                return trans('validation.custom.exist',['attribute' => 'El panel', 'error'],404);
            }
        }else if($device=="device"){
            $panel=$this->getPanel($id);
            if($panel != null){
                $zone = $panel->zones()->with('devices','devices.zone', 'devices.types')->get()->pluck('devices')->flatten();
                foreach ($zone as $device) {
                    $mongoData = DeviceMDB::find($device->data_id);
                    $latestEntry = ['_id' => $device->data_id, 'data' => []];
            
                    foreach ($mongoData['data'] as $field => $entries) {
                        $mongo_info = $mongoData['data'][$field];
                        foreach ($mongoData['data'] as $field => $entries) {
                            $mongo_info = $mongoData['data'][$field];
                            if(is_array($mongo_info))$latestEntry['data'][$field] = end($mongo_info);
                            if(!is_array($mongo_info))$latestEntry['data'][$field] = $mongo_info;
                        }
                    }

                    $device->info = $latestEntry;
                }
            }
        }else if($device=="devicefull"){
            $panel=$this->getPanel($id);
            if($panel != null){
                $zone = $panel->zones()->with('devices','devices.zone', 'devices.types')->get()->pluck('devices')->flatten();
                foreach ($zone as $device) {
                    $mongoData = DeviceMDB::find($device->data_id);
                    $device["info"]=$mongoData;
                }
            }else{
               return trans('validation.custom.exist',['attribute' => 'El panel', 'error'],404);
            }

        }else{
            $panel=$this->getPanel($id);
            if($panel != null){
                $zone = $panel->zones()->get();
            }else{
               return trans('validation.custom.exist',['attribute' => 'El panel', 'error'],404);
            }
            
        }
        return response()->json(['success' => true, 'data' => $zone],200);
    }

   
    public function store(Request $request,$id)
    {
        $user=$this->databaseConfig();
        $panel=$this->getPanel($id);
        if($panel->pivot->admin== true || $panel->pivot->zones==true){
            $requestData = $request->all();
            $requestData['panel_id'] = $id;
            $validator = Validator::make($requestData, [
                'name' => ['required','string','min:2','max:50'],
                'country' => ['required','string','min:2','max:50'],
                'lat' => ['required','numeric'],
                'lng' => ['required','numeric'],
                'max_soil_moisture' => ['numeric','min:-1000', 'max:1000'],
                'min_soil_moisture' => ['numeric','min:-1000', 'max:1000'],
                'max_soil_temp' => ['numeric','min:-1000', 'max:1000'],
                'min_soil_temp' => ['numeric','min:-1000', 'max:1000'],
                'min_air_temp' => ['numeric','min:-1000', 'max:1000'],
                'max_air_temp' => ['numeric','min:-1000', 'max:1000'],
                'panel_id' =>['required','exists:panels,id'],
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 401);
            }

            $zoneData=[
                'name' => $request->name,
                'country' => $request->country,
                'lat' => $request->lat,
                'lng' => $request->lng,
                'panel_id'=> $id,
            ];
            if($request->max_soil_moisture){
                $zoneData['max_soil_moisture']=$request->max_soil_moisture;
            }
            if($request->min_soil_moisture){
                $zoneData['min_soil_moisture']=$request->min_soil_moisture;
            }
            if($request->max_soil_temp){
                $zoneData['max_soil_temp']=$request->max_soil_temp;
            }
            if($request->min_soil_temp){
                $zoneData['min_soil_temp']=$request->min_soil_temp;
            }
            if($request->min_air_temp){
                $zoneData['min_air_temp']=$request->min_air_temp;
            }

            if($request->max_air_temp){
                $zoneData['max_air_temp']=$request->max_air_temp;
            }


            $zone = Zone::create($zoneData);
            return response()->json(['success' => true, 'data' => $zone], 200);
        }else{
            return response()->json(['error' => 'No tienes permisos'], 550);
        }
        
    }

 
    public function show(String $id_zone, $id)
    {
        $user=$this->databaseConfig();
        $panel=$this->getPanel($id);
        $zone = $panel->zones()->find($id_zone)->get();
        if($zone != null)return response()->json(['data' => $zone]);
        return trans('validation.custom.exist',['attribute' => 'La zona', 'error']);
    }

    public function irrigate(Request $request, String $id, $id_zone)
    {
        $user=$this->databaseConfig();
        $panel=$this->getPanel($id);
        if($panel != null && $request->value){

            if($panel->pivot->admin== true || $panel->pivot->irrigate==true){
                $zone = $panel->zones()->get()->find($id_zone);
                if($zone==null){
                    return trans('validation.custom.exist',['attribute' => 'La zona', 'error']);
                }
                $zone = $panel->zones()->with('devices','devices.zone', 'devices.types')->get()->pluck('devices')->flatten();
                foreach ($zone as $device) {
                    if ($device['types'][0]['name'] == "irrigate") {
                        DeviceMDB::where('_id', $device->data_id)->update(['data.irrigate' => $request->value]);
                    }
                }
                return response()->json(['success' => true, 'data' => $zone], 200);
            }else{
                return response()->json(['error' => 'No tienes permisos'], 550);
            }


        }else{
           return trans('validation.custom.exist',['attribute' => 'El panel', 'error'],404);
        }
        
    }


    public function update(Request $request, String $id, $id_zone)
    {
        $user=$this->databaseConfig();
        $requestData = $request->all();
        $requestData['panel_id'] = $id;
        $validator = Validator::make($requestData, [
            'name' => ['required','string','min:2','max:50'],
            'country' => ['required','string','min:2','max:50'],
            'lat' => ['required','numeric'],
            'lng' => ['required','numeric'],
            'max_soil_moisture' => ['numeric','min:-1000', 'max:1000'],
            'min_soil_moisture' => ['numeric','min:-1000', 'max:1000'],
            'max_soil_temp' => ['numeric','min:-1000', 'max:1000'],
            'min_soil_temp' => ['numeric','min:-1000', 'max:1000'],
            'min_air_temp' => ['numeric','min:-1000', 'max:1000'],
            'max_air_temp' => ['numeric','min:-1000', 'max:1000'],
            'panel_id' =>['required','exists:panels,id']
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $panel=$this->getPanel($id);
        if($panel->pivot->admin== true || $panel->pivot->zones==true){
            $zone = $panel->zones()->get()->find($id_zone);
            if($zone==null){
                return trans('validation.custom.exist',['attribute' => 'La zona', 'error']);
            }
            $zone->update($requestData);
            $zone = $panel->zones()->get()->find($id_zone);
            return response()->json(['success' => true, 'data' => $zone], 200);
        }else{
            return response()->json(['error' => 'No tienes permisos'], 550);
        }
    }


    public function destroy(String $id, $id_zone)
    {
        $user=$this->databaseConfig();
        $panel=$this->getPanel($id);
        if($panel->pivot->admin== true || $panel->pivot->zones==true){
            $zone = $panel->zones()->find($id_zone);
            if($zone==null)return trans('validation.custom.exist',['attribute' => 'La zona', 'error']);
            $zone->delete();
            return response()->json(['success' => true, 'data' => $zone], 200);
        }else{
            return response()->json(['error' => 'No tienes permisos'], 550);
        }
    }
}
