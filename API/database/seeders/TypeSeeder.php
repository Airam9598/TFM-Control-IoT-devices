<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::connection('mysql')->table('types')->insert([
            'name' => 'soil Moisture',
        ]);
        DB::connection('mysql')->table('types')->insert([
            'name' => 'soil temperature',
        ]);
        DB::connection('mysql')->table('types')->insert([
            'name' => 'air temperature',
        ]);
        DB::connection('mysql')->table('types')->insert([
            'name' => 'precipitation',
        ]);
        DB::connection('mysql')->table('types')->insert([
            'name' => 'camera',
        ]);
    }
}
