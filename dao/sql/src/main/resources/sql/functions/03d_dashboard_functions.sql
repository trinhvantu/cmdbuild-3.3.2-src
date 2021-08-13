-- dashboard functions
-- REQUIRE PATCH 3.0.0-03a_system_functions

CREATE OR REPLACE FUNCTION _cm3_dashboard_disk_usage_actual() RETURNS TABLE (item varchar, type varchar, status varchar, count bigint, size bigint, size_pretty varchar) AS $$ BEGIN
    RETURN QUERY WITH _sizes AS (SELECT CASE WHEN _cm3_class_is_history(x.item) THEN _cm3_class_parent_get(x.item) ELSE x.item END _item, x.total_size _size FROM _cm3_utils_disk_usage_detailed() x),
        _tables AS ( SELECT x.item, x.type, (SELECT SUM(_size) FROM _sizes s WHERE s._item = x.item) _tsize FROM _cm3_utils_disk_usage_detailed() x WHERE x.type <> 'history'),
        _records AS (
            SELECT "IdClass" _type, COUNT(*) _count, "Status" _status FROM "Class" GROUP BY "IdClass", "Status" 
            UNION ALL SELECT "IdClass" _type, COUNT(*) _count, "Status" _status FROM "SimpleClass" GROUP BY "IdClass", "Status" 
            UNION ALL SELECT "IdDomain" _type, COUNT(*) _count, "Status" _status FROM "Map" GROUP BY "IdDomain", "Status"),
        _items AS (SELECT t.*, s._status FROM _tables t CROSS JOIN (SELECT unnest(ARRAY['A','U','N']) _status) s),
        _q AS (SELECT i.*, COALESCE(r._count, 0) _count FROM _items i LEFT JOIN _records r ON i.item = r._type AND i._status = r._status),
        _qs AS (SELECT *, CASE _count WHEN 0 THEN 0 ELSE q._tsize * _count / (SELECT SUM(_count) FROM _q i WHERE i.item = q.item) END _size FROM _q q)
        SELECT 
            _cm3_utils_regclass_to_name(q.item),
            CASE WHEN q.type ~ 'class|simpleclass' AND _cm3_class_features_get(q.item, 'MODE') <> 'default' THEN 'system' ELSE q.type END, 
            q._status::varchar status, 
            q._count::bigint "count", 
            q._size::bigint size, 
            pg_size_pretty(_size)::varchar size_pretty FROM _qs q ORDER BY _size DESC;
END $$ LANGUAGE PLPGSQL;

-- COMMENT TYPE: function|cached: true
CREATE OR REPLACE FUNCTION _cm3_dashboard_disk_usage() RETURNS TABLE (item varchar, type varchar, status varchar, count bigint, size bigint, size_pretty varchar) AS $$ BEGIN
    RETURN QUERY SELECT * from _cm3_get_cached_records('_cm3_dashboard_disk_usage_actual'::regproc) AS (item varchar, type varchar, status varchar, count bigint, size bigint, size_pretty varchar);
END $$ LANGUAGE PLPGSQL;

-- COMMENT TYPE: function
CREATE OR REPLACE FUNCTION _cm3_dashboard_model_stats() RETURNS TABLE (type varchar, count bigint) AS $$ BEGIN
    RETURN QUERY SELECT x."type"::varchar, x."count" FROM (
        SELECT 'class' "type", (SELECT COALESCE(COUNT(*),0) count FROM _cm3_class_list() c WHERE NOT _cm3_class_is_process(c) AND _cm3_class_features_get(c, 'MODE') = 'default')
        UNION ALL SELECT 'processclass' "type", (SELECT COALESCE(COUNT(*),0) count FROM _cm3_class_list() c WHERE _cm3_class_is_process(c) AND _cm3_class_is_superclass(c) = false AND (_cm3_class_features_get(c, 'MODE') = 'default' OR _cm3_class_features_get(c, 'MODE') = 'all'))
        UNION ALL SELECT 'domain' "type", (SELECT COALESCE(COUNT(*),0) count FROM _cm3_domain_list() d)
        UNION ALL SELECT 'report' "type", (SELECT COALESCE(COUNT(*),0) count FROM "_Report" WHERE "Status" = 'A')
        UNION ALL SELECT 'dashboard' "type", (SELECT COALESCE(COUNT(*),0) count FROM "_Dashboard" WHERE "Status" = 'A')
        UNION ALL SELECT 'view' "type", (SELECT COALESCE(COUNT(*),0) count FROM "_View" WHERE "Status" = 'A')
        UNION ALL SELECT 'custompage' "type", (SELECT COALESCE(COUNT(*),0) count FROM "_UiComponent" WHERE "Status" = 'A' AND "Type" = 'custompage')
        ) x ORDER BY x.count DESC;
END $$ LANGUAGE PLPGSQL;

-- COMMENT TYPE: function
CREATE OR REPLACE FUNCTION _cm3_dashboard_user_group_session() RETURNS TABLE (type varchar, count bigint) AS $$ BEGIN
    RETURN QUERY SELECT 'user'::varchar "type", COUNT(*) "count" FROM "User" WHERE "Status" = 'A' AND "Active" = TRUE
        UNION ALL SELECT 'group'::varchar "type", COUNT(*) "count" FROM "Role" WHERE "Status" = 'A' AND "Active" = TRUE
        UNION ALL SELECT 'session'::varchar "type", COUNT(*) "count" FROM "_Session";
END $$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION _cm3_dashboard_records_history_actual() RETURNS TABLE (type varchar, date date, count bigint) AS $$ BEGIN
    RETURN QUERY WITH _enddate AS ( SELECT unnest(ARRAY[now(),now()-'1 year'::interval,now()-'2 year'::interval,now()-'3 year'::interval,now()-'4 year'::interval]) _end ),
        _types AS (SELECT unnest(ARRAY['card','process','document','relation']) _type),
        _rows AS (SELECT * FROM _types CROSS JOIN _enddate),
        _records AS ( SELECT 'card' _type, "CurrentId" _id, "BeginDate", "EndDate", "Status" FROM "Class" WHERE NOT _cm3_class_is_process("IdClass") AND NOT _cm3_class_is_dmsmodel("IdClass") AND _cm3_class_features_get("IdClass", 'MODE') = 'default' AND "Status" IN ('A','U')
            UNION SELECT 'card' _type, "Id" _id, "BeginDate", NULL, "Status" FROM "SimpleClass" WHERE _cm3_class_features_get("IdClass", 'MODE') = 'default'
            UNION SELECT 'process' _type, "CurrentId" _id, "BeginDate", "EndDate", "Status" FROM "Activity" WHERE "Status" IN ('A','U')
            UNION SELECT 'document' _type, "CurrentId" _id, "BeginDate", "EndDate", "Status" FROM "DmsModel" WHERE "Status" IN ('A','U')
            UNION SELECT 'email' _type, "CurrentId" _id, "BeginDate", "EndDate", "Status" FROM "Email" WHERE "Status" IN ('A','U')
            UNION SELECT 'relation' _type, "CurrentId" _id, "BeginDate", "EndDate", "Status" FROM "Map" WHERE "Status" IN ('A','U') )
        SELECT * FROM ( SELECT _type::varchar "type", _end::date "date", (SELECT COUNT(_id) FROM _records r WHERE r._type = e._type AND ( ( r."Status" = 'A' AND r."BeginDate" < e._end )  OR ( r."Status" = 'U' AND r."BeginDate" < e._end AND r."EndDate" > e._end ) )) "count" FROM _rows e ) x ORDER BY "type", "date";
END $$ LANGUAGE PLPGSQL;

-- COMMENT TYPE: function|cached: true
CREATE OR REPLACE FUNCTION _cm3_dashboard_records_history() RETURNS TABLE (type varchar, date date, count bigint) AS $$ BEGIN
    RETURN QUERY SELECT * from _cm3_get_cached_records('_cm3_dashboard_records_history_actual'::regproc) as (type varchar, date date, count bigint);
END $$ LANGUAGE PLPGSQL;

-- COMMENT TYPE: function|scheduled: */10 * * * ?
CREATE OR REPLACE FUNCTION _cm3_dashboard_functions_load() RETURNS VOID AS $$ BEGIN
    PERFORM _cm3_dashboard_records_history();
    PERFORM _cm3_dashboard_disk_usage();
END $$ LANGUAGE PLPGSQL;

