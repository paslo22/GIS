$(document).ready(function() {
	map = new ol.Map({
	target: 'map',
	// layers: [
	// 	new ol.layer.Tile({
	// 			title: "Provincias",
	// 			source: new ol.source.TileWMS({
	// 				url: '/cgi-bin/qgis_mapserv.fcgi?map='+ config['pathToQGS'] + config['QGSName'],
	// 				// url: '/cgi-bin/qgis_mapserv.fcgi?map=/home/user/data/tpi/web/tpi.qgs',
	// 				params: {'LAYERS': 'provincias'}
	// 			})
	// 		})
	// 	],
		view: new ol.View({
			projection: 'EPSG:4326',
			center:[-59, -39],
			zoom: 5
		})
	});

	getCapabilities();
})

getCapabilities = function() {
	var parser = new ol.format.WMSCapabilities();
	var capabilitiesString = "http://localhost/cgi-bin/qgis_mapserv.fcgi?map=/home/user/data/tpi/web/tpi.qgs&service=WMS&REQUEST=getCapabilities"
	$.ajax(capabilitiesString).then(function(response) {
		var result = parser.read(response);
		return result.Capability.Layer.Layer;
	}).then(function(capas) {
		addLayers(capas);
		addChecks(capas);
	})
};

addLayers = function(capas) {
	$.each(capas,function(i) {
		map.addLayer(new ol.layer.Tile({
			title: capas[i].Title,
			source: new ol.source.TileWMS({
				url: '/cgi-bin/qgis_mapserv.fcgi?map='+ config['pathToQGS'] + config['QGSName'],
				params: {'LAYERS': capas[i].Title}
			}),
			visible: false
		}))
	})
};

addChecks = function(capas) {
	c = capas;
	container = $("#checks");
	$.each(capas,function(i) {
		var output = '';
		output += '<div class="layer">';
		output += '<input type="checkbox" id='+ capas[i].Title +' />';
		// output += '<label>'+ capas[i].Title +' <label/>'; // <- Esto no iria.
		output += '<img src='+ capas[i].Style[0].LegendURL[0].OnlineResource +' />';
		output += '</div>';
		container.append(output);
	});

	var checkboxs = $('input[type="checkbox"]');
	checkboxs.each(function(index, el) {
		var layerName = $(el).attr('id');
		layer = map.getLayers().getArray().filter(function(a) {
			return (a.getProperties().title == layerName)
		});
		bindear(layer[0],el);
	});
};

bindear = function(layer, element) {
	$(element).change(function(event) {
		var checked = this.checked;
			if (checked !==layer.getVisible()) {
				layer.setVisible(checked);
			};
	});
};