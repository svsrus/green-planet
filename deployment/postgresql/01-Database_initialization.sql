CREATE ROLE green_planet_usr WITH
	LOGIN
	NOSUPERUSER
	CREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'xxxxxx';
	
CREATE DATABASE green_planet_db
    WITH 
    OWNER = green_planet_usr
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
	
ALTER ROLE green_planet_usr SET client_encoding TO 'utf8';
ALTER ROLE green_planet_usr SET default_transaction_isolation TO 'read committed';
ALTER ROLE green_planet_usr SET timezone TO 'UTC';

GRANT ALL PRIVILEGES ON DATABASE green_planet_db TO green_planet_usr;