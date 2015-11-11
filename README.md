# gis

Lo forma más sencilla de hacer funcionar esto es clonar la carpeta en el siguiente path:
/var/www/html/{Nombre Carpeta que quieran}/

Para crear la carpeta esa tienen que tener permiso de usuario y cambiar el dueño de la misma.
Ej: (Nombre de ejemplo "TPI")

sudo mkdir /var/www/html/TPI/

sudo chown user:user /var/www/html/TPI/

Luego hacer el clone dentro de esa carpeta.
Copiar el archivo de qGIS a la carpeta creada.
Después de haber descargado la carpeta tienen que crear un archivo dentro de la carpeta js con el nombre config.js con lo siguiente:

```JSON
var config = {
	pathToQGS:'/var/www/html/TPI/gis',   //
	QGSName:'tpi.qgs'                 // Nombre del archivo
}
```

Y debería funcionar.
