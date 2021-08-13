-- lock
-- REQUIRE PATCH 3.0.0-52


--- LOCK FUNCTIONS ---

CREATE OR REPLACE FUNCTION _cm3_lock_aquire_try(_item_id varchar, _session_id varchar, _request_id varchar, _scope varchar, _time_to_live_seconds int, _current_timestamp timestamptz) RETURNS TABLE (is_aquired boolean, lock_id bigint) AS $$ DECLARE
    _current "_Lock";
BEGIN
    IF _scope NOT IN ('session', 'request') THEN 
        RAISE 'invalid scope = %', _scope;
    END IF;
    PERFORM pg_advisory_xact_lock('"_Lock"'::regclass::oid::bigint);
    SELECT INTO _current * FROM "_Lock" WHERE "ItemId" = _item_id;
    IF NOT ( _current IS NULL ) AND _current."LastActiveDate" + format('%s seconds', _current."TimeToLive")::interval < _current_timestamp THEN
        DELETE FROM "_Lock" WHERE "Id" = _current."Id";
        RAISE DEBUG 'removed expired lock = %', _current;
        _current = NULL;
    END IF;
    IF _current IS NULL THEN
        INSERT INTO "_Lock" ("ItemId", "SessionId", "RequestId", "Scope", "TimeToLive", "LastActiveDate") VALUES (_item_id, _session_id, _request_id, _scope, _time_to_live_seconds, _current_timestamp) RETURNING * INTO _current;
        RAISE DEBUG 'aquired new lock = %', _current;
        RETURN QUERY SELECT TRUE, _current."Id";
    ELSE
        IF ( _current."Scope" = 'session' AND _scope = 'session' AND _current."SessionId" = _session_id ) 
            OR ( _current."Scope" = 'request' AND _scope = 'request' AND _current."SessionId" = _session_id AND _current."RequestId" = _request_id ) THEN
                UPDATE "_Lock" SET "LastActiveDate" = _current_timestamp, "TimeToLive" = _time_to_live_seconds WHERE "Id" = _current."Id" RETURNING * INTO _current;
                RAISE DEBUG 'renewed existing lock = %', _current;
                RETURN QUERY SELECT TRUE, _current."Id";
        ELSE
            RAISE DEBUG 'unable to aquire lock, already aquired by = % (expiring on = % )', _current, ( _current."LastActiveDate" + format('%s seconds', _current."TimeToLive")::interval );
            RETURN QUERY SELECT FALSE, _current."Id";
        END IF;
    END IF;
END $$ LANGUAGE PLPGSQL;

