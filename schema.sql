create table todos(
    id serial primary key,
    priority integer not null,
    todos varchar(50) not null,
    status boolean default false
);

