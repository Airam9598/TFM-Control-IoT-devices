<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use App\Models\Device;
use App\Models\Type;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use Jenssegers\Mongodb\Eloquent\Model;
use App\Models\DeviceMDB;
use Carbon\Carbon;

class DeviceController extends Controller
{

    private function databaseConfig(){
        Config::set('database.default', 'mysql');
        return $user = Auth::user();
    }

    private function getZone($id,$zone_id){
        $user=$this->databaseConfig();
        $panel = $user->panels()->find($id);
        $zone = $panel->zones()->find($zone_id);
        return $zone;
    }

    private function getPanel($id,$zone_id){
        $user=$this->databaseConfig();
        $panel = $user->panels()->find($id);
        return $panel;
    }

    public function index(Request $request,$id,$zone_id,$info=null)
    {
        $user=$this->databaseConfig();
        $panel=$this->getPanel($id,$zone_id);
        $query = $request->input('q');
        if($query!=null){
            $zone=$this->getZone($id,$zone_id);
            $devices= $zone->devices()->get()->where('name', 'like', '%'.$query.'%')
                    ->orWhere('data_id', 'like', '%'.$query.'%')->with('zone', 'types');
        }else if($info == "recent" && ($panel->pivot->admin== true || $panel->pivot->irrigate==true || $panel->pivot->camera==true)){
            $zone=$this->getZone($id,$zone_id);
            if($zone !=null){
                $devices= $zone->devices()->with('zone', 'types')->get();
                foreach ($devices as $device) {
                    $mongoData = DeviceMDB::find($device->data_id);
                    $latestEntry = ['_id' => $device->data_id, 'data' => []];
            
                    foreach ($mongoData['data'] as $field => $entries) {
                        $mongo_info = $mongoData['data'][$field];
                        if(is_array($mongo_info))$latestEntry['data'][$field] = end($mongo_info);
                        if(!is_array($mongo_info))$latestEntry['data'][$field] = $mongo_info;
                    }

                    $device->info = $latestEntry;
                }
            }else{
                return trans('validation.custom.exist',['attribute' => 'El panel o la zona', 'error'],404);
            }

        }else if($info == "history" && ($panel->pivot->admin== true || $panel->pivot->history==true)){
            $zone=$this->getZone($id,$zone_id);
            if($zone !=null){
                $devices= $zone->devices()->with('zone', 'types')->get();
                foreach ($devices as $device) {
                    $mongoData = DeviceMDB::find($device->data_id);
                    $device["info"]=$mongoData;
                }
            }else{
                return trans('validation.custom.exist',['attribute' => 'El panel o la zona', 'error'],404);
            }
        }else{
            $zone=$this->getZone($id,$zone_id);
            if($zone !=null){
                $devices= $zone->devices()->with('zone', 'types')->get();
            }else{
                return trans('validation.custom.exist',['attribute' => 'El panel o la zona', 'error'],404);
            }
            
        }
        
        return response()->json(['success' => true, 'data' => $devices],200);
    }

   
    public function store(Request $request,$id,$zone_id)
    {
        $user=$this->databaseConfig();
        $panel=$this->getPanel($id,$zone_id);
        if($panel->pivot->admin== true || $panel->pivot->devices==true){
            $requestData = $request->all();
            $requestData['zone_id'] = $zone_id;
            $validator = Validator::make($requestData, [
                'name' => ['required','string','min:2','max:50'],
                'dev_id' =>['required','string','min:2','max:50'],
                'zone_id' =>['required','exists:zones,id'],
                'type' => 'required|array',
                'type.*' =>['required','exists:types,id'],
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 401);
            }

            $deviceData=[
                'name' => $request->name,
                'dev_id' => $request->dev_id,
                'zone_id'=>$zone_id,
                'type'=>$request->type
            ];
            $data = [
                'data' => []
            ];
            $typeNames = Type::whereIn('id', $request->type)->pluck('name', 'id');
            foreach ($typeNames as $type) {
                if($type=="irrigate"){
                    $data['data'][$type] = false;
                }else if($type=="camera"){
                    if($request->url){
                        $data['data'][$type] = $request->url;
                    }else{
                        $data['data'][$type] = "";
                    }
                    
                }else{
                    $data['data'][$type] = [];
                }
                
            }
            $newData = DeviceMDB::create($data);
            $newData->save();
            $deviceData["data_id"]=$newData->_id;
            $device = Device::create($deviceData);
            $device->types()->attach($request->type);
            $device->load('zone', 'types');
            $mongoData = DeviceMDB::find($device->data_id);
            $device["info"]=$mongoData;
            return response()->json(['success' => true, 'data' => $device], 200);
        }else{
            return response()->json(['error' => 'No tienes permisos'], 550);
        }
    }

 
    public function show(String $id,$zone_id, $device_id,$info= null)
    {
        $this->databaseConfig();

        $zone=$this->getZone($id,$zone_id);
        $device = $zone->devices()->with('zone', 'types')->find($device_id);
        
        if($device != null){
            if($info != null){
                $panel=$this->getPanel($id,$zone_id);
                if($info == "history" && $panel->pivot->admin== true || $panel->pivot->history==true){
                    $mongoData = DeviceMDB::find($device->data_id);
                    $device["info"]=$mongoData;
                }else if($info == "recent" && $panel->pivot->admin== true || $panel->pivot->irrigate==true || $panel->pivot->camera==true){
                    $mongoData = DeviceMDB::find($device->data_id);
                    $latestEntry=['_id'=>$device->data_id, 'data'=>[]];
                    foreach ($mongoData['data'] as $field => $entries) {
                        $mongo_info = $mongoData['data'][$field];
                        $latestEntry['data'][$field]= end($mongo_info);
                    }
                    $device["info"]=$latestEntry;
                }else{
                    return response()->json(['error' => 'No tienes permisos'], 550);
                }
            }
            
            return response()->json(['data' => $device]);
        }
        return trans('validation.custom.exist',['attribute' => 'El dispositivo', 'error']);
    }


    public function update(Request $request, String $id,$zone_id, $device_id)
    {
        $this->databaseConfig();
        $panel=$this->getPanel($id,$zone_id);
        if($panel->pivot->admin== true || $panel->pivot->devices==true){
            $requestData = $request->all();
            $requestData['zone_id'] = $zone_id;
            $validator = Validator::make($requestData, [
                'name' => ['sometimes','string','min:2','max:50'],
                'data_id' =>['sometimes','string','min:2','max:50'],
                'zone_id' =>['sometimes','exists:zones,id'],
                'type' =>['sometimes','exists:types,id'],
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 401);
            }

            $zone=$this->getZone($id,$zone_id);
            $device = $zone->devices()->with('zone', 'types')->find($device_id);
            $typeNames = Type::whereIn('id', $request->type)->pluck('name', 'id');
            foreach ($typeNames as $type) {
                if($type=="camera"){
                    if($request->url){
                        DeviceMDB::where('_id', $device->data_id)->update(['data.camera' => $request->url]);
                    }
                }
            }
            if($device==null)return trans('validation.custom.exist',['attribute' => 'El dispositivo', 'error']);
            $device->update($request->all());
            $device->types()->detach();
            $device->types()->attach($request->type);
            $device = $zone->devices()->with('zone', 'types')->find($device_id);
            return response()->json(['success' => true, 'data' => $device], 200);
        }else{
            return response()->json(['error' => 'No tienes permisos'], 550);
        }
    }

    public function updateMongo(Request $request, String $device_id)
    {
        $this->databaseConfig();

            $validator = Validator::make($request->all(), [
                'value' => ['required'],
                'type' =>['required','exists:types,id'],
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 401);
            }
            $deviceMySQL = Device::where('dev_id', $device_id)->first();
            if($deviceMySQL == null)return trans('validation.custom.exist',['attribute' => 'El dispositivo', 'error']);
            $device = DeviceMDB::find($deviceMySQL->data_id);
            if($device == null)return trans('validation.custom.exist',['attribute' => 'El dispositivo', 'error']);

            $typeName = Type::where('id', $request->type)->first()->name;
            $newData = ['value' => $request->value, 'date' => Carbon::now()];
            
            $deviceData = $device->getAttribute('data');
            $deviceData[$typeName][] = $newData;
            
            $device->setAttribute('data', $deviceData);
            $device->save();
            return response()->json(['success' => true, 'data' => $device], 200);
    }


    public function destroy(String $id,$zone_id, $device_id)
    {
        $this->databaseConfig();
        $panel=$this->getPanel($id,$zone_id);
        if($panel->pivot->admin== true || $panel->pivot->devices==true){
            $zone=$this->getZone($id,$zone_id);
            $device = $zone->devices()->with('zone', 'types')->find($device_id);
            if($device==null)return trans('validation.custom.exist',['attribute' => 'El dispositivo', 'error']);
            $device->delete();
            return response()->json(['success' => true, 'data' => $device], 200);
        }else{
            return response()->json(['error' => 'No tienes permisos'], 550);
        }
    }
}
