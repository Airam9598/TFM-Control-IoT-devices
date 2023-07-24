<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use App\Models\Panel;
use Illuminate\Http\Request;

class PanelController extends Controller
{
    private function databaseConfig(){
        Config::set('database.default', 'mysql');
        return $user = Auth::user();
    }

    public function index(Request $request)
    {
        $user=$this->databaseConfig();
        $query = $request->input('q');
        if($query!=null){
            $panel = $user->panels()->whereNull('deleted_at')->where('name', 'like', '%'.$query.'%');
        }else{
            $panel = $user->panels()->get();
            foreach($panel as $pane){
                if($pane->pivot->admin== true){
                    $pane->with('users');
                }
            }
        }
        return response()->json(['success' => true, 'data' => $panel],200);
    }

   
    public function store(Request $request)
    {
        $user=$this->databaseConfig();
        $validator = Validator::make($request->all(), [
            'name' => ['required','string','min:2','max:50'],
            'diference_days' => ['required','numeric','min:0']
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $panelData=[
            'name' => $request->name,
            'diference_days' =>$request->diference_days,
        ];
        $panel = Panel::create($panelData);
        $panel->users()->attach($user->id);
        return response()->json(['success' => true, 'data' => $panel], 200);
    }

 
    public function show(String $id)
    {
        $user=$this->databaseConfig();
        $panel = $user->panels()->find($id);
        
        if($panel != null){
            return response()->json(['data' => $panel]);
        }
        return trans('validation.custom.exist',['attribute' => 'El panel', 'error']);
    }


    public function update(Request $request, String $id)
    {
        $user=$this->databaseConfig();
        $validator = Validator::make($request->all(), [
            'name' => ['sometimes','string','min:2','max:50'],
            'diference_days' => ['sometimes','numeric','min:0']
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $panel = $user->panels()->find($id);
        if($panel==null)return trans('validation.custom.exist',['attribute' => 'El panel', 'error']);
        $panel->update($request->all());
        $panel = $user->panels()->find($id);
        return response()->json(['success' => true, 'data' => $panel], 200);
    }


    public function destroy(String $id)
    {
        $user=$this->databaseConfig();
        $panel = $user->panels()->find($id);
        if($panel==null)return trans('validation.custom.exist',['attribute' => 'El panel', 'error']);
        $panel->delete();
        return response()->json(['success' => true, 'data' => $panel], 200);
    }
}