<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Type;
use Illuminate\Http\Request;

class TypeController extends Controller
{
    private function databaseConfig(){
        Config::set('database.default', 'mysql');
        return $user = Auth::user();
    }

    public function index(Request $request)
    {
        $this->databaseConfig();
        $query = $request->input('q');
        if($query!=null){
             $type = Type::whereNull('deleted_at')->where('name', 'like', '%'.$query.'%');
        }else{
            $type = Type::get();
        }
        return response()->json(['success' => true, 'data' => $type],200);
    }

   
    public function store(Request $request)
    {
        $this->databaseConfig();
        $validator = Validator::make($request->all(), [
            'name' => ['required','string','min:2','max:50']
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $typeData=[
            'name' => $request->name
        ];

        $type = Type::create($typeData);
        return response()->json(['success' => true, 'data' => $type], 200);
    }

 
    public function show(String $id)
    {
        $this->databaseConfig();
        $type = Type::find($id);
        if($type != null)return response()->json(['data' => $type]);
        return trans('validation.custom.exist',['attribute' => 'El tipo de dispositivo', 'error']);
    }


    public function update(Request $request, String $id)
    {
        $this->databaseConfig();
        $validator = Validator::make($request->all(), [
            'name' => ['required','string','min:2','max:50']
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $type = Type::find($id);
        if($type==null)return trans('validation.custom.exist',['attribute' => 'El tipo de dispositivo', 'error']);
        $type->update($request->all());
        $type = Type::find($id);
        return response()->json(['success' => true, 'data' => $type], 200);
    }


    public function destroy(String $id)
    {
        $this->databaseConfig();
        $type = Type::find($id);
        if($type==null)return trans('validation.custom.exist',['attribute' => 'El tipo de dispositivo', 'error']);
        $type->delete();
        return response()->json(['success' => true, 'data' => $type], 200);
    }
}
