ALTER TABLE "recipe_instructions" RENAME COLUMN "recipie_id" TO "recipe_id";--> statement-breakpoint
ALTER TABLE "recipe_instructions" DROP CONSTRAINT "recipe_instructions_recipie_id_recipes_id_fk";
--> statement-breakpoint
ALTER TABLE "recipe_instructions" ADD CONSTRAINT "recipe_instructions_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;