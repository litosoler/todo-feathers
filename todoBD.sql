create table Prioridades(
idPrioridad int auto_increment primary key,
descripcion varchar(45)
);

create table Todos(
	id int auto_increment primary key,
    descripcion varchar(45) not null,
    nivelprioridad int null,
    foreign key(nivelPrioridad) references Prioridades(idPrioridad)
    );
    