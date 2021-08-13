-- mixed system access function


--- PLACEHOLDERS (db objects that are required here to create functions, but will be replaced in other patches later) ---

CREATE TABLE "SimpleClass" (id int);


-- legacy functions cleanup
 
DROP FUNCTION IF EXISTS _cm3_function_list(
		OUT function_name text,
		OUT function_id oid,
		OUT arg_io char[],
		OUT arg_names text[],
		OUT arg_types text[],
		OUT returns_set boolean,
		OUT comment text,
		OUT metadata jsonb
	);

-- mixed functions (legacy definitions)

CREATE OR REPLACE FUNCTION _cm3_card_cascade_after_delete(_card bigint) RETURNS void AS $$ BEGIN
    UPDATE "Map" SET "Status" = 'N' WHERE "Status" = 'A' AND ( "IdObj1" = _card OR "IdObj2" = _card );
END $$ LANGUAGE PLPGSQL;