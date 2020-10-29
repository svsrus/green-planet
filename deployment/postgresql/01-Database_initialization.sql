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

insert into green_planet_article_keyword (article_keyword_id, text) values (1, 'Что я могу сделать сам');
insert into green_planet_article_keyword (article_keyword_id, text) values (2, 'Что может сделать семья');
insert into green_planet_article_keyword (article_keyword_id, text) values (3, 'Что может сделать человечество');
insert into green_planet_article_keyword (article_keyword_id, text) values (4, 'Que puedo hacer yo solo');
insert into green_planet_article_keyword (article_keyword_id, text) values (5, 'Que puede hacer una familia');
insert into green_planet_article_keyword (article_keyword_id, text) values (6, 'Que puede hacer la humanidad');
insert into green_planet_article_keyword (article_keyword_id, text) values (7, 'What can I do by myself');
insert into green_planet_article_keyword (article_keyword_id, text) values (8, 'What a family can do');
insert into green_planet_article_keyword (article_keyword_id, text) values (9, 'What a humanity can do');

delete from green_planet_video_representation;
delete from green_planet_image_representation;
delete from green_planet_representation;
delete from green_planet_article_representation;
delete from green_planet_article_article_keywords;
delete from green_planet_article_keyword where article_keyword_id > 3;
delete from green_planet_article;