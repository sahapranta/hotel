<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2);
            $table->string('type')->default('standard'); // e.g., standard, deluxe, suite
            $table->boolean('is_available')->default(true);
            $table->json('amenities')->nullable(); // e.g., WiFi, TV, Mini-bar
            $table->unsignedInteger('capacity')->default(1);
            $table->foreignIdFor(App\Models\Hotel::class)->constrained()->onDelete('cascade');            
            $table->foreignIdFor(App\Models\User::class)->constrained();            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
