<?php

namespace App\Http\Controllers;
use App\Models\DeviceMDB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use App\Models\Panel;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

class PanelController extends Controller
{

    public function index(Request $request)
    {
        Try{
            $this->databaseConfig();
            $panels = $this->user->panels();
            $panels= $this->filter($panels,["name" => "like"],$request);
            $panels= $panels->get();
            foreach($panels as $panel){
                if($panel->pivot->admin == true){
                    $panel->with('users');
                }
            }
            return $this->correctResult($panels);
        }catch(Exception){
            return $this->error;
        }
    }


    public function store(Request $request)
    {
        Try{
            $this->databaseConfig();

            $this->validate($request->all(), [
                'name' => ['required','string','min:2','max:50'],
                'diference_days' => ['required','numeric','min:0']
            ]);

            $panelData=[
                'name' => $request->name,
                'diference_days' =>$request->diference_days,
            ];
            $this->panel = Panel::create($panelData);
            $this->panel->users()->attach($this->user->id);
            $this->getPanel($this->panel->id);
            return $this->correctResult($this->panel);
        }catch(Exception){
            return $this->error;
        }
    }


    public function show(String $id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            return $this->correctResult($this->panel);
        }catch(Exception){
            return $this->error;
        }

    }


    public function update(Request $request, String $id)
    {
        Try{
            $this->databaseConfig();
            $this->validate($request->all(), [
                'name' => ['sometimes','string','min:2','max:50'],
                'diference_days' => ['sometimes','numeric','min:0']
            ]);

            $this->getPanel($id);
            $this->panel->update($request->all());
            $this->getPanel($id);
            return $this->correctResult($this->panel);
        }catch(Exception){
            return $this->error;
        }
    }


    public function destroy(String $id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->panel->delete();
            return $this->correctResult($this->panel);
        }catch(Exception){
            return $this->error;
        }
    }


    protected function getDevices(Request $request,String $id){
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $zone = $this->panel->zones();
            $zone = $this->filter($zone,["name" => "like"],$request);
            $data=$zone->with('devices','devices.zone', 'devices.types')->get();
            $devices=collect($data)->pluck('devices')->flatten() ;
            foreach ($devices as $device) {
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
            return $this->correctResult($devices);
        }catch(Exception){
            return $this->error;
        }
    }
    protected function getDeviceFull(Request $request,String $id){
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $zone = $this->panel->zones();
            $zone = $this->filter($zone,["name" => "like"],$request);
            $data=$zone->with('devices','devices.zone', 'devices.types')->get();
            $devices=collect($data)->pluck('devices')->flatten() ;
            foreach ($devices as $device) {
                $mongoData = DeviceMDB::find($device->data_id);
                $device["info"] = $mongoData;
            }
            return $this->correctResult($devices);
        }catch(Exception){
            return $this->error;
        }

    }
}
