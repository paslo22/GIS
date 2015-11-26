<?php

header('Content-type: text/html; charset=utf-8;');
$wkt =  $_GET['wkt'];
$capasString = $_GET['capas'];
$capasArray = explode(';', $capasString);
$link= pg_connect("host=localhost user=user password=user dbname=TPI");

$salida = '';

foreach ($capasArray as $key => $value) {
	
$query=<<<EOD
SELECT * FROM public."$value" WHERE 
ST_Intersects(
ST_GeomFromText('$wkt',4326),
geom
) LIMIT 100 
EOD;
	echo $query;
	$result = pg_query($query);
	$nro_campos = pg_num_fields($result);
	$nro_registros = pg_num_rows($result);
	$header = '<h1>'.$value.'</h1><h3>Nro. Registros: '.$nro_registros.'</h3><table border=1 id="tabla" style="background-color: #330000;
    color: white;"><tr>';
	while ($i < $nro_campos) { 
		$fieldName = pg_field_name($result, $i); 
		
		if($fieldName!='geom'){
			$header.= '<td>' . $fieldName .'</td>'; 
		}
		$i++;
	}
	$header .= '</tr>';

	$cuerpo='';
	while ($row = pg_fetch_row($result)) { 
		$cuerpo.= '<tr>';
		$i=0;
		while ($i < $nro_campos) { 
			 if(pg_field_name($result, $i)!='geom'){
				 $cuerpo.= '<td>' . $row[$i] . '</td>';
			}
			$i++;
		} 
		$cuerpo.= '</tr>'; 
	}

$salida .= $header . $cuerpo . '</table><br>';

}







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