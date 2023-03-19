create table users(
user_id SERIAL primary key,
username varchar(100) not null unique,
passhash varchar(200) not null
);


create table uploads(
file_id BIGSERIAL primary key,
file_hash varchar(200) not null,
file_name varchar(200) not null,
file_size varchar(200) not null,
owner_id varchar(100) not null,
owner_name varchar(100) not null,
upload_time varchar(200) not null,
blocked_status varchar(50) not null
);

