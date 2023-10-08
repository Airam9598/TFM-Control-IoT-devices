<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Type;
use Exception;
use Illuminate\Http\Request;

class TypeController extends Controller
{

    public function index(Request $request)
    {
        Try{
            $this->databaseConfig();
            $type = $this->filter(Type::query(),["name"=>"like"],$request);
            return $this->correctResult($type->get());
        }catch(Exception){
            return $this->error;
        }
    }


    public function store(Request $request)
    {
        Try{
            $this->databaseConfig();
            $this->validate($request->all(), [
                'name' => ['required','string','min:2','max:50']
            ]);

            $typeData=[
                'name' => $request->name
            ];

            $type = Type::create($typeData);
            return $this->correctResult($type);
        }catch(Exception){
            return $this->error;
        }
    }


    public function show(String $id)
    {
        Try{
            $this->databaseConfig();
            $type = Type::find($id);
            if($type != null) return $this->correctResult($type);
            return trans('validation.custom.exist',['attribute' => 'El tipo de dispositivo', 'error']);
        }catch(Exception){
            return $this->error;
        }
    }


    public function update(Request $request, String $id)
    {
        Try{
            $this->databaseConfig();
            $this->validate($request->all(), [
                'name' => ['required','string','min:2','max:50']
            ]);

            $type = Type::find($id);
            if($type==null)return trans('validation.custom.exist',['attribute' => 'El tipo de dispositivo', 'error']);
            $type->update($request->all());
            $type = Type::find($id);
            return $this->correctResult($type);
        }catch(Exception){
            return $this->error;
        }
    }


    public function destroy(String $id)
    {
        Try{
            $this->databaseConfig();
            $type = Type::find($id);
            if($type==null)return trans('validation.custom.exist',['attribute' => 'El tipo de dispositivo', 'error']);
            $type->delete();
            return $this->correctResult($type);
        }catch(Exception){
            return $this->error;
        }
    }
}
