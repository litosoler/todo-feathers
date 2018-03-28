
create table Prioridades(
id int auto_increment primary key,
descripcion varchar(45)
);

create table Todos(
	id int auto_increment primary key,
    descripcion varchar(45) not null,
    nivelprioridad int null,
    completed boolean default false,
    foreign key(nivelPrioridad) references Prioridades(id)
    );
    
select * from todos;

insert into todos(descripcion, completed)
values ("comprar leche", 0 ),
		("comprar pan", 1),
        ("comprar azucar", 0),
        ("ir al super", 1);
    
    
