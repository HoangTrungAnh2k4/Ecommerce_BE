drop database if exists ecommerce_web;

create database ecommerce_web;

use ecommerce_web;

create table
    user (
        id int primary key auto_increment,
        name varchar(255) not null,
        email varchar(255) not null,
        address varchar(255),
        phoneNumber varchar(255) not null unique,
        role enum ('admin', 'user') not null DEFAULT 'user'
    );

create table
    auth_credentials (
        user_id int primary key,
        phoneNumber varchar(255) not null unique,
        password varchar(255) not null,
        foreign key (user_id) references user (id) on delete cascade
    );

create table
    equipment (
        id int primary key auto_increment,
        type varchar(255) not null,
        name varchar(255) not null unique,
        price int not null,
        discount int not null check (
            discount >= 0
            and discount <= 100
        ),
        sold_quantity int not null check (sold_quantity >= 0),
        best_seller boolean not null default false,
        stock_quantity int not null default 0,
        image_url varchar(255) not null
    );

create table
    evaluation (
        id int primary key auto_increment,
        value int not null check (
            value >= 0
            and value <= 5
        ),
        comment varchar(255),
        user_id int not null,
        user_name varchar(255) not null,
        equipment_id int not null,
        date datetime not null default current_timestamp,
        foreign key (user_id) references user (id) on delete cascade,
        foreign key (equipment_id) references equipment (id) on delete cascade
    );

create table
    cart (
        id int primary key auto_increment,
        user_id int not null,
        foreign key (user_id) references user (id) on delete cascade
    );

create table
    cart_item (
        cart_id int not null,
        equipment_id int not null,
        quantity int not null check (quantity > 0),
        primary key (cart_id, equipment_id),
        foreign key (cart_id) references cart (id) on delete cascade,
        foreign key (equipment_id) references equipment (id) on delete cascade
    );

create table
    order_common (
        order_id int primary key auto_increment,
        user_id int not null,
        foreign key (user_id) references user (id) on delete cascade,
        date datetime not null default current_timestamp
    );

create table
    order_detail (
        order_id int not null,
        equipment_id int not null,
        quantity int not null,
        primary key (order_id, equipment_id),
        foreign key (order_id) references order_common (order_id) on delete cascade
    );