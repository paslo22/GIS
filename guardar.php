<?php
$coord =  $_POST['coord'];
$lugar=$_POST['lugar'];
$fecha=$_POST['fecha'];
$duracion=$_POST['duracion'];
$calificacion=$_POST['calificacion'];

$link= pg_connect("host=localhost user=user password=user dbname=TPI");


	
$query=<<<EOD
INSERT INTO visitas(geom, nombre_lugar, fecha_visita, duracion, calificacion)
    VALUES (ST_GeomFromText('$coord',4326),'$lugar', '$fecha', '$duracion', '$calificacion');
EOD;

$result = pg_query($query);
echo pg_affected_rows($result);
?>
