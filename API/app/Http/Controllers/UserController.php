<?php

namespace App\Http\Controllers;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Panel;
use Hash;

class UserController extends Controller
{

    private function databaseConfig(){
        Config::set('database.default', 'mysql');
        return $user = Auth::user();
    }


    public function index(Request $request,String $id)
    {
        $user=$this->databaseConfig();
        $panel = $user->panels()->find($id);

        $query = $request->input('q');
        if($query!=null){
            if($panel != null && $panel->pivot->admin== true){
                $users = Panel::with('users')->find($id);
                $user=$panel->users->where('name', 'like', '%'.$query.'%')
                ->orWhere('email', 'like', '%'.$query.'%');
            }else{
                return response()->json(['error' => 'No tienes permisos'], 550);
            }
        }else{
            
            if($panel != null && $panel->pivot->admin== true){
                $users = Panel::with('users')->find($id);
                $user=$panel->users;
            }else{
                return response()->json(['error' => 'No tienes permisos'], 550);
            }
        }
        return response()->json(['success' => true, 'data' => $user],200);
    }

   
    public function store(Request $request, $id=null)
    {
        $actuser=$this->databaseConfig();
        if($actuser!= null){
            $panel = $actuser->panels()->find($id);
            if($panel != null){
                $validator = Validator::make($request->all(), [
                    'email' =>['required','email','min:5','max:50','exists:users,email'],
                ]);
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 401);
                }
                $changeuser=User::where('email', $request->email)->first();
                if($changeuser == null){
                    return response()->json(['error' => 'No tienes permisos'], 550);
                }
                $user = $actuser->panels()->attach($id, ['user_id' => $changeuser->id]);
                $user=$panel->users()->find($changeuser->id);
                return response()->json(['success' => true, 'data' => $user], 200);
            }
        }
        if($id == null){
            $validator = Validator::make($request->all(), [
                'name' => ['required','string','min:2','max:50'],
                'email' =>['required','email','min:5','max:50','unique:users,email'],
                'password' =>['required',Password::min(8)->mixedCase()->letters()->numbers()->symbols()],
                'repassword' =>['required', 'same:password'],
            ]);
    
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 401);
            }
            
            $userData=[
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ];
    

            $user = User::create($userData);
            $user->load('panels');
            return response()->json(['success' => true, 'data' => $user], 200);

        }
        return response()->json(['error' => 'No tienes permisos'], 550);
    }

 
    public function show(String $id=null,$id_user=null)
    {

        $actuser=$this->databaseConfig();
        if($actuser!= null){
            $panel = $actuser->panels()->find($id);
            if($panel != null && $actuser->id==$id_user){
                $users = Panel::with('users')->find($id);
                $user=$panel->users->find($id_user);
                if($user != null){
                    return response()->json(['success' => true, 'data' => $user], 200);
                }
            }else if($panel != null && $actuser->id!=$id_user && $panel->pivot->admin==true){
                $users = Panel::with('users')->find($id);
                $user=$panel->users->find($id_user);
                if($user != null){
                    return response()->json(['success' => true, 'data' => $user], 200);
                }
            }
        }
        return response()->json(['error' => 'No tienes permisos'], 550);
    }


    public function update(Request $request, String $id=null,$id_user=null)
    {
        $actuser=$this->databaseConfig();
        if($actuser!= null){
            if($id!= null && $actuser->id==$id_user){
                $panel = $actuser->panels()->find($id);
                if($panel==null || $panel->pivot->admin==false){
                    return response()->json(['error' => 'No tienes permisos'], 550);
                }

                $validator = Validator::make($request->all(), [
                    'admin' => ['required','boolean'],
                    'history' =>['required','boolean'],
                    "camera"=>['required','boolean'],
                    "devices"=>['required','boolean'],
                    "zones"=>['required','boolean'],
                    "irrigate"=>['required','boolean'],
                ]);
    
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 401);
                }
                $panel->users()->updateExistingPivot($id_user, [
                    'admin' => $request->admin,
                    'history' => $request->history,
                    'camera' => $request->camera,
                    'devices' => $request->devices,
                    'zones' => $request->zones,
                    'irrigate' => $request->irrigate,

                ]);
                return response()->json(['success' => true, 'data' => $panel->users()->find($id_user)], 200);
            }else if($id!= null && $actuser->id!=$id_user){
                $panel = $actuser->panels()->find($id);
                if($panel==null || $panel->pivot->admin==false){
                    return response()->json(['error' => 'No tienes permisos'], 550);
                }

                $validator = Validator::make($request->all(), [
                    'admin' => ['required','boolean'],
                    'history' =>['required','boolean'],
                    "camera"=>['required','boolean'],
                    "devices"=>['required','boolean'],
                    "zones"=>['required','boolean'],
                    "irrigate"=>['required','boolean'],
                ]);
    
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 401);
                }
                $panel->users()->updateExistingPivot($id_user, [
                    'admin' => $request->admin,
                    'history' => $request->history,
                    'camera' => $request->camera,
                    'devices' => $request->devices,
                    'zones' => $request->zones,
                    'irrigate' => $request->irrigate,

                ]);
                return response()->json(['success' => true, 'data' => $panel->users()->find($id_user)], 200);
            }else if($id== null){
                $validator = Validator::make($request->all(), [
                    'name' => ['sometimes','string','min:2','max:50'],
                    'email' =>['sometimes','email','min:5','max:50','unique:users,email'],
                    'password' =>['sometimes',Password::min(8)->mixedCase()->letters()->numbers()->symbols()],
                    'oldpassword' =>['sometimes','different:password']
                ]);
    
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 401);
                }
                $actuser=$this->databaseConfig();
                if (Hash::check($request->oldpassword, $actuser->password)) {
                    return response()->json(['error' => 'La contraseña es incorrecta'], 401);
                }
                $actuser->update($request->all());
                $user = User::with('panels')->find($actuser->id);
                return response()->json(['success' => true, 'data' => $user], 200);
            }else{
                return response()->json(['error' => 'No tienes permisos'], 550);
            }

        }else{
            return response()->json(['error' => 'No tienes permisos'], 550);
        }
    }


    public function destroy(String $id=null,$id_user=null)
    {
        $actuser=$this->databaseConfig();
        if($actuser!= null){
            if($id!= null && $actuser->id==$id_user){
                $panel = $actuser->panels()->find($id);
                if($panel==null ){
                    return response()->json(['error' => 'No tienes permisos'], 550);
                }
                $panel->users()->detach($id_user);
                return response()->json(['success' => true, 'data' => $actuser], 200);
            }else if($id!= null && $actuser->id!=$id_user){
                $panel = $actuser->panels()->find($id);
                if($panel==null || $panel->pivot->admin==false){
                    return response()->json(['error' => 'No tienes permisos'], 550);
                }
                $user=$panel->users->find($id_user);
                if($user==null)return response()->json(['error' => 'El usuario no existe'], 401);
                $panel->users()->detach($id_user);
                return response()->json(['success' => true, 'data' => $user], 200);
            }else if($id== null){
                $actuser->delete();
                return response()->json(['success' => true, 'data' => $actuser], 200);
            }else{
                return response()->json(['error' => 'No tienes permisos'], 550);
            }
        }else{
            return response()->json(['error' => 'No tienes permisos'], 550);
        }
        
    }
}
