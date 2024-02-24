create table lenguas_iso(
	uid UUID primary key,
	iso_language varchar(50) not null,
	code_639 char(2) not null
);

create table plan_suscripcion(
	uid UUID primary key,
	nombre_plan varchar(50) not null,
	descripcion varchar(100) not null,
	precio_por_usuario int not null,
	periodo varchar(50) not null
);

create table suscripcion(
	uid UUID primary key,
	estado boolean not null,
	fecha_inicio date not null,
	fecha_fin date not null,
	uid_plan_suscripcion UUID references plan_suscripcion(uid),
	uid_empresa UUID references empresa(uid)	
);

create table empresa(
	uid UUID primary key,
	nombre_empresa varchar(100) not null,
	correo_electronico varchar(100) not null,
	password_user varchar(100) not null,
	direccion varchar(100) not null,
	ciudad varchar(100) not null,
	tipo_entidad varchar(100) not null,
	nit int not null,
	logo_url varchar(2000) not null		
);

create table usuario (
	uid UUID primary key,
	fullname varchar(100) not null,
	correo_electronico varchar(100) not null,
	password_user varchar(100) not null,
	foto_perfil_url varchar(100),
	rol_user varchar(20) not null,
	uid_empresa UUID references empresa(uid),
	uid_lenguas_iso UUID references lenguas_iso(uid),
	uid_contacto UUID references usuario(uid)
);

create table bitacora(
	uid UUID primary key,
	accion varchar(100) not null,
	fecha date not null,
	hora time not null,	
	uid_usuario UUID references usuario(uid)
);

create table chat(
	uid UUID primary key,
	id_socket varchar(100) not null,
	uid_usuario_emisor UUID references usuario(uid),
	uid_usuario_receptor UUID references usuario(uid)
);

create table messages(
	uid UUID primary key,
	mensaje varchar(2000) not null,
	uid_chat UUID references chat(uid)
);
--drop table messages
--drop table bitacora

alter table usuario 
add column estado boolean;

alter table empresa 
add column estado boolean;

alter table empresa 
add column rol_user varchar(20);

ALTER TABLE bitacora
ALTER COLUMN accion TYPE varchar(2000);

ALTER TABLE empresa
ALTER COLUMN logo_url DROP NOT NULL;

--cambios 04/12/2023:

ALTER TABLE empresa ALTER COLUMN nit TYPE BIGINT;
alter table empresa add column cantidad_usuarios int;
alter table messages add column uid_usuario UUID;
alter table messages add column audio_url varchar(2000);
alter table suscripcion add column total_pagado int;

--cambios 05/12/2023:

alter table messages add column code_639 char(2);

ALTER TABLE usuario
ALTER COLUMN foto_perfil_url TYPE varchar(2000);

alter table bitacora add column uid_empresa UUID references empresa(uid)

ALTER TABLE chat
add column estado boolean;

ALTER TABLE messages
add column estado boolean;

-- cambios 14/01/2024

ALTER TABLE messages
add column fecha date;

ALTER TABLE messages
add column hora time;

select * from messages;


