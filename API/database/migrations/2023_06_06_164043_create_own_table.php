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
        Schema::connection('mysql')->create('own', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('panel_id');
            $table->boolean('admin')->default(true);
            $table->boolean('history')->default(true);
            $table->boolean('camera')->default(true);
            $table->boolean('devices')->default(true);
            $table->boolean('zones')->default(true);
            $table->boolean('irrigate')->default(true);
            $table->foreign("user_id")->references("id")->on("users")->onDelete('cascade')->onUpdate('cascade');
            $table->foreign("panel_id")->references("id")->on("panels")->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
            $table->primary(['user_id', 'panel_id']);
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
        Schema::dropIfExists('own');
    }
};
