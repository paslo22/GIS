<?php
header('Content-type: text/html; charset=utf-8;');
$wkt =  $_GET['coordenadas'];
$nombre_lugar=$_GET['lugar'];
$fecha_visita=$_GET['fecha'];
$duracion=$_GET['duracion'];
$calificacion=$_GET['calificacion'];

$link= pg_connect("host=localhost user=user password=user dbname=gis");


	
$query=<<<EOD
INSERT INTO visitas(
            geom, nombre_lugar, fecha_visita, duracion, calificacion)
    VALUES (ST_GeomFromText($wkt,4326),$nombre_lugar, $fecha_visita, $duracion, $calificacion);
EOD;

echo $query;
$result = pg_query($query);
exit('success');







?>
<!doctype html>
<html lang="en">
	<head>
		<style>
			body, table{
				font-family: Arial, Helvetica, sans-serif;
				font-size: 11px;
							
			}
		</style>
	</head>
<body>



<?php echo $salida ?>

</body>
</html>