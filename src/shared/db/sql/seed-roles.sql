INSERT INTO "role" ("id", "label")
VALUES ('user', 'User'),
       ('moderate', 'Moderator'),
       ('admin', 'Administrator') ON CONFLICT ("id") DO
UPDATE SET "label" = EXCLUDED."label";
