CREATE TABLE Visitas(
	gid serial PRIMARY KEY, 
	geom geography(POINT,4326), 
	nombre_lugar VARCHAR(50),
	fecha_visita DATE,
	duracion INT,
	calificacion INT
)
WITH (
  OIDS=FALSE
);

/*INSERT INTO visitas(
            gid, geom, nombre_lugar, fecha_visita, duracion, calificacion)
    VALUES (1,'0101000020E61000009485FF3F518E50C030E9FD3F81E535C0', 'la Villa', '3/11/1930', 3, 5);
*/    