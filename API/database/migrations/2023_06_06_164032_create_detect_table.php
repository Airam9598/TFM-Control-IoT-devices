<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mysql')->create('detect', function (Blueprint $table) {
            $table->unsignedBigInteger('dev_id');
            $table->unsignedBigInteger('type_id');
            $table->foreign("dev_id")->references("id")->on("devices")->onDelete('cascade')->onUpdate('cascade');
            $table->foreign("type_id")->references("id")->on("types")->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
            $table->primary(['dev_id', 'type_id']);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('detect');
    }
};
