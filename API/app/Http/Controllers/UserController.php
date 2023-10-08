<?php

namespace App\Http\Controllers;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use Illuminate\Http\Request;
use Exception;
use Hash;

class UserController extends Controller
{


    public function index(Request $request,String $id)
    {
        Try{
            $this->databaseConfig();
            $this->getPanel($id);
            $this->PermissionChecker(["admin"]);
            $user=$this->panel->users();
            $user = $this->filter($user,["name" => "like" , "email" => "like"],$request,"OR");
            return $this->correctResult($user->get());
        }catch(Exception){
            return $this->error;
        }
    }


    public function store(Request $request, $id=null)
    {
        Try{
            $this->databaseConfig();
            if($this->user){
                $this->getPanel($id);
                $this->validate($request->all(), [
                    'email' =>['required','email','min:5','max:50','exists:users,email'],
                ]);

                $changeuser=User::where('email', $request->email)->first();
                if($changeuser == null){
                    return response()->json(['error' => 'No tienes permisos'], 550);
                }
                $user = $this->user->panels()->attach($id, ['user_id' => $changeuser->id]);
                $user=$this->panel->users()->find($changeuser->id);
                return $this->correctResult($user);
            }
            if($id == null){
               $this->validate($request->all(), [
                    'name' => ['required','string','min:2','max:50'],
                    'email' =>['required','email','min:5','max:50','unique:users,email'],
                    'password' =>['required',Password::min(8)->mixedCase()->letters()->numbers()->symbols()],
                    'repassword' =>['required', 'same:password'],
                ]);

                $userData=[
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password)
                ];
                $user = User::create($userData);
                $user->load('panels');
                return $this->correctResult($user);

            }
            return response()->json(['error' => 'No tienes permisos'], 550);
        }catch(Exception){
            return $this->error;
        }
    }


    public function show(String $id=null,$id_user=null)
    {
        Try{
            $this->databaseConfig();
            if(!$this->user){
                return response()->json(['error' => 'No tienes permisos'], 550);
            }
            $this->getPanel($id);

            if($this->user->id==$id_user){
                $user=$this->panel->users->find($id_user);
                if($user != null){
                    return $this->correctResult($user);
                }
            }else if($this->user->id!=$id_user && $this->panel->pivot->admin==true){
                $user=$this->panel->users->find($id_user);
                if($user != null){
                    return $this->correctResult($user);
                }
            }

            return response()->json(['error' => 'No tienes permisos'], 550);

        }catch(Exception){
            return $this->error;
        }

    }

//REVISAR
    public function update(Request $request, String $id=null,$id_user=null)
    {
        Try{
            $this->databaseConfig();
            if(!$this->user){
                return response()->json(['error' => 'No tienes permisos'], 550);
            }

            if($id!= null && $this->user->id==$id_user){
                $this->getPanel($id);
                if($this->panel->pivot->admin==false){
                    return response()->json(['error' => 'No tienes permisos'], 550);
                }

                $this->validate($request->all(), [
                    'admin' => ['required','boolean'],
                    'history' =>['required','boolean'],
                    "camera"=>['required','boolean'],
                    "devices"=>['required','boolean'],
                    "zones"=>['required','boolean'],
                    "irrigate"=>['required','boolean'],
                ]);

                $this->panel->users()->updateExistingPivot($id_user, [
                    'admin' => $request->admin,
                    'history' => $request->history,
                    'camera' => $request->camera,
                    'devices' => $request->devices,
                    'zones' => $request->zones,
                    'irrigate' => $request->irrigate,

                ]);
                return $this->correctResult($this->panel->users()->find($id_user));

            }else if($id!= null && $this->user->id!=$id_user){
                $this->getPanel($id);
                $this->PermissionChecker(["admin"]);

                $this->validate($request->all(), [
                    'admin' => ['required','boolean'],
                    'history' =>['required','boolean'],
                    "camera"=>['required','boolean'],
                    "devices"=>['required','boolean'],
                    "zones"=>['required','boolean'],
                    "irrigate"=>['required','boolean'],
                ]);

                $this->panel->users()->updateExistingPivot($id_user, [
                    'admin' => $request->admin,
                    'history' => $request->history,
                    'camera' => $request->camera,
                    'devices' => $request->devices,
                    'zones' => $request->zones,
                    'irrigate' => $request->irrigate,

                ]);
                return $this->correctResult($this->panel->users()->find($id_user));
            }else if($id== null){
                $this->validate($request->all(), [
                    'name' => ['sometimes','string','min:2','max:50'],
                    'email' =>['sometimes','email','min:5','max:50','unique:users,email'],
                    'password' =>['sometimes',Password::min(8)->mixedCase()->letters()->numbers()->symbols()],
                    'oldpassword' =>['sometimes','different:password']
                ]);

                if (Hash::check($request->oldpassword, $this->user->password)) {
                    return response()->json(['error' => 'La contraseña es incorrecta'], 401);
                }
                $this->user->update($request->all());
                $user = User::with('panels')->find($this->user->id);
                return $this->correctResult($user);
            }

            return response()->json(['error' => 'No tienes permisos'], 550);

        }catch(Exception){
            return $this->error;
        }

    }


    public function destroy(String $id=null,$id_user=null)
    {
        Try{
            $this->databaseConfig();
            if(!$this->user){
            return response()->json(['error' => 'No tienes permisos'], 550);
            }

            if($id!= null && $this->user->id==$id_user){
                $this->getPanel($id);

                $this->panel->users()->detach($id_user);
                return response()->json(['success' => true, 'data' => $this->user], 200);
            }else if($id!= null && $this->user->id!=$id_user){
                $this->getPanel($id);
                $this->PermissionChecker(["admin"]);
                $user=$this->panel->users->find($id_user);
                if($user==null)return response()->json(['error' => 'El usuario no existe'], 401);
                $this->panel->users()->detach($id_user);
                return response()->json(['success' => true, 'data' => $user], 200);
            }else if($id== null){
                $this->user->delete();
                return response()->json(['success' => true, 'data' => $this->user], 200);
            }else{
                return response()->json(['error' => 'No tienes permisos'], 550);
            }
        }catch(Exception){
            return $this->error;
        }

    }
}
