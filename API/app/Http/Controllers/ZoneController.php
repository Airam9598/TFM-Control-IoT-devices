<?php

namespace App\Http\Controllers;
use App\Models\Zone;
use Illuminate\Http\Request;
use App\Models\DeviceMDB;
use Exception;

class ZoneController extends Controller
{


    public function index(Request $request,String $id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $zone = $this->panel->zones();
            $zone = $this->filter($zone,["name" => "like"],$request);
            return $this->correctResult($zone->get());
        }catch(Exception){
            return $this->error;
        }
    }


    public function store(Request $request,$id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->PermissionChecker(["admin","zones"]);

            $requestData = $request->all();
            $requestData['panel_id'] = $id;
            $this->validate($requestData, [
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
                'panel_id' => ['required','exists:panels,id'],
            ]);

            $zoneData=[
                'name' => $request->name,
                'country' => $request->country,
                'lat' => $request->lat,
                'lng' => $request->lng,
                'panel_id' => $id,
                'max_soil_moisture' => $request->max_soil_moisture ?? null,
                'min_soil_moisture' => $request->min_soil_moisture ?? null,
                'max_soil_temp' => $request->max_soil_temp ?? null,
                'min_soil_temp' => $request->min_soil_temp ?? null,
                'min_air_temp' => $request->min_air_temp ?? null,
                'max_air_temp' => $request->max_air_temp ?? null,
            ];

            $this->zone = Zone::create($zoneData);
            return $this->correctResult($this->zone);
        }catch(Exception){
            return $this->error;
        }
    }


    public function show(String $id, $id_zone)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->getZone($id_zone);
            return $this->correctResult($this->zone);
        }catch(Exception){
            return $this->error;
        }
    }

    //REVISAR
    public function irrigate(Request $request, String $id, $id_zone)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            if(!$request->value){
                return trans('validation.custom.exist',['attribute' => 'El panel', 'error'],404);
            }

            $this->PermissionChecker(["admin","irrigate"]);

            $this->getZone($id_zone);
            $this->zone = $this->panel->zones()->with('devices','devices.zone', 'devices.types')->get()->pluck('devices')->flatten();
            foreach ($this->zone as $device) {
                if ($device['types'][0]['name'] == "irrigate") {
                    DeviceMDB::where('_id', $device->data_id)->update(['data.irrigate' => $request->value]);
                }
            }
            return $this->correctResult($this->zone);
        }catch(Exception){
            return $this->error;
        }

    }


    public function update(Request $request, String $id, $id_zone)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $requestData = $request->all();
            $requestData['panel_id'] = $id;
            $this->validate($requestData, [
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

            $this->PermissionChecker(["admin","zones"]);
            $this->getZone($id_zone);
            $this->zone->update($requestData);
            $this->getZone($id_zone);
            return $this->correctResult($this->zone);
        }catch(Exception){
            return $this->error;
        }
    }


    public function destroy(String $id, $id_zone)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->PermissionChecker(["admin","zones"]);
            $this->getZone($id_zone);
            $this->zone->delete();
            return $this->correctResult($this->zone);
        }catch(Exception){
            return $this->error;
        }
    }

}
