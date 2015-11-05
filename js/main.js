$(document).ready(function() {
	var map = new ol.Map({
	target: 'map',
	layers: [
		new ol.layer.Tile({
				title: "Provincias",
				source: new ol.source.TileWMS({
					url: '/cgi-bin/qgis_mapserv.fcgi?map='+ config['pathToQGS'] + config['QGSName'],
					// url: '/cgi-bin/qgis_mapserv.fcgi?map=/home/user/data/tpi/web/tpi.qgs',
					params: {'LAYERS': 'provincias'}
				})
			})
		],
		view: new ol.View({
			projection: 'EPSG:4326',
			center:[-59, -27.5],
			zoom: 4
		})
	});
})