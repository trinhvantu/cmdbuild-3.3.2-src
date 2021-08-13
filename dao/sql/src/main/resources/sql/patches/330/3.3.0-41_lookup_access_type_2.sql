-- lookup access fix

UPDATE "_LookupType" SET "Access" = 'protected' WHERE "Code" IN ('CalendarFrequency','CalendarPriority','CalendarCategory') AND "Status" = 'A';


