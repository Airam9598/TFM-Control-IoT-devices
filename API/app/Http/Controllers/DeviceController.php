<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use App\Models\Device;
use App\Models\Type;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use Jenssegers\Mongodb\Eloquent\Model;
use App\Models\DeviceMDB;
use Carbon\Carbon;
use DateTime;
use Exception;
use MongoDB\BSON\UTCDateTime;

class DeviceController extends Controller
{

    public function index(Request $request,$id,$zone_id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $query = $request->input('q');
            if($query!=null){
                $devices= $this->zone->devices()->get()->where('name', 'like', '%'.$query.'%')
                        ->orWhere('data_id', 'like', '%'.$query.'%')->with('zone', 'types');
            }else{
                $this->getZone($zone_id);
                $devices= $this->zone->devices()->with('zone', 'types')->get();
            }

            return $this->correctResult($devices);
        }catch(Exception){
            return $this->error;
        }
    }


    public function store(Request $request,$id,$zone_id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->PermissionChecker(["admin","devices"]);
            $requestData = $request->all();
            $requestData['zone_id'] = $zone_id;
            $this->validate($requestData, [
                'name' => ['required','string','min:2','max:50'],
                'dev_id' =>['required','string','min:2','max:50'],
                'zone_id' =>['required','exists:zones,id'],
                'type' => 'required|array',
                'type.*' =>['required','exists:types,id'],
            ]);

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
            return $this->correctResult($device);
        }catch(Exception){
            return $this->error;
        }
    }


    public function show(String $id,$zone_id, $device_id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->getZone($zone_id);
            $this->getDevice($device_id);
            return $this->correctResult($this->device);
        }catch(Exception){
            return $this->error;
        }
    }


    public function update(Request $request, String $id,$zone_id, $device_id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->getZone($zone_id);
            $this->PermissionChecker(["admin","devices"]);
            $requestData = $request->all();
            $requestData['zone_id'] = $zone_id;
            $this->validate($requestData, [
                'name' => ['sometimes','string','min:2','max:50'],
                'data_id' =>['sometimes','string','min:2','max:50'],
                'zone_id' =>['sometimes','exists:zones,id'],
                'type' =>['sometimes','exists:types,id'],
            ]);


            $this->getDevice($device_id);
            $typeNames = Type::whereIn('id', $request->type ?? $this->device->types)->pluck('name', 'id');
            foreach ($typeNames as $type) {
                if($type=="camera"){
                    if($request->url){
                        DeviceMDB::where('_id', $this->device->data_id)->update(['data.camera' => $request->url]);
                    }
                }
            }
            $this->device->update($request->all());
            $this->device->types()->detach();
            $this->device->types()->attach($request->type);
            $this->getDevice($device_id);
            return $this->correctResult($this->device);

        }catch(Exception){
            return $this->error;
        }
    }

    public function updateMongo(Request $request, String $device_id)
    {
        Try{
            $this->databaseConfig();
            $this->validate($request->all(), [
                'value' => ['required'],
                'type' =>['required','exists:types,id'],
            ]);

            $deviceMySQL = Device::where('dev_id', $device_id)->first();
            if($deviceMySQL == null)return trans('validation.custom.exist',['attribute' => 'El dispositivo', 'error']);
            $device = DeviceMDB::find($deviceMySQL->data_id);
            if($device == null)return trans('validation.custom.exist',['attribute' => 'El dispositivo', 'error']);

            $typeName = Type::where('id', $request->type)->first()->name;
            $newData = ['value' => $request->value, 'date' => (new UTCDateTime(new DateTime()))];

            $deviceData = $device->getAttribute('data');
            $deviceData[$typeName][] = $newData;

            $device->setAttribute('data', $deviceData);
            $device->save();
            return $this->correctResult($device);
        }catch(Exception){
            return $this->error;
        }
    }


    public function destroy(String $id,$zone_id, $device_id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->getZone($zone_id);
            $this->PermissionChecker(["admin","devices"]);
            $this->getDevice($device_id);
            $this->device->delete();
            return $this->correctResult($this->device);
        }catch(Exception){
            return $this->error;
        }
    }

    public function getAllRecent(Request $request,$id,$zone_id){
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->PermissionChecker(["admin","irrigate", "camera"]);
            $this->getZone($zone_id);
            $devices= $this->zone->devices()->with('zone', 'types')->get();
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

            return $this->correctResult($devices);
        }catch(Exception){
            return $this->error;
        }
    }

    public function getAllHistory(Request $request,$id,$zone_id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->PermissionChecker(["admin","history"]);
            $this->getZone($zone_id);
            $devices= $this->zone->devices()->with('zone', 'types')->get();
            foreach ($devices as $device) {
                $mongoData = DeviceMDB::find($device->data_id);
                $device["info"]=$mongoData;
            }

            return $this->correctResult($devices);
        }catch(Exception){
            return $this->error;
        }
    }

    public function showOneHistory(String $id,$zone_id, $device_id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->getZone($zone_id);
            $device = $this->zone->devices()->with('zone', 'types')->find($device_id);
            if($device != null){
                $this->PermissionChecker(["admin","history"]);
                $mongoData = DeviceMDB::find($device->data_id);
                $device["info"]=$mongoData;
                return $this->correctResult($device);
            }
            return trans('validation.custom.exist',['attribute' => 'El dispositivo', 'error']);
        }catch(Exception){
            return $this->error;
        }
    }

    public function showOneRecent(String $id,$zone_id, $device_id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->getZone($zone_id);
            $device = $this->zone->devices()->with('zone', 'types')->find($device_id);

            if($device != null){
                $this->PermissionChecker(["admin","irrigate","camera"]);
                $mongoData = DeviceMDB::find($device->data_id);
                $latestEntry=['_id'=>$device->data_id, 'data'=>[]];
                foreach ($mongoData['data'] as $field => $entries) {
                    $mongo_info = $mongoData['data'][$field];
                    $latestEntry['data'][$field]= end($mongo_info);
                }
                $device["info"]=$latestEntry;
                return $this->correctResult($device);
            }
            return trans('validation.custom.exist',['attribute' => 'El dispositivo', 'error']);
        }catch(Exception){
            return $this->error;
        }
    }
}
