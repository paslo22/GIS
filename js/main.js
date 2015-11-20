$(document).ready(function() {
	map = new ol.Map({
		target: 'map',
		view: new ol.View({
			projection: 'EPSG:4326',
			center:[-59, -39],
			zoom: 5
		})
	});

	getCapabilities();
	setInteractions();
	
})

getCapabilities = function() {
	var parser = new ol.format.WMSCapabilities();
	var capabilitiesString = "http://localhost/cgi-bin/qgis_mapserv.fcgi?map="+ config['pathToQGS'] + config['QGSName']+"&service=WMS&REQUEST=getCapabilities"
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
	container = $("#checks");
	$.each(capas,function(i) {
		var output = '';
		output += '<div class="layer">';
		output += '<input type="checkbox" id="'+ capas[i].Title +'" />';
		output += '<img src="'+ capas[i].Style[0].LegendURL[0].OnlineResource +'" />';
		output += '</div>';
		container.append(output);
	});

	var checkboxs = $('#checks input[type="checkbox"]');
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

setInteractions = function() {
	$('#controls #navegacion')[0].checked=true;
	$('#controls #consulta')[0].checked=false;

	var selectInteraction = new ol.interaction.DragBox({
		condition: ol.events.condition.always,
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [0, 0, 255, 1]
			})
		})
	});

	selectInteraction.on('boxend', function (evt) {
		consulta(this.getGeometry().getCoordinates());
	});

	var clickOnMap = function(evt) {
		consulta(evt.coordinate);
	};

	var getCheckedLayers = function() {
		var layersSelected = $('#checks input:checked');
		var layersSelectedNames = '';
		layersSelected.each(function(index, el) {
			layersSelectedNames+=el.id+';';
		});
		layersSelectedNames = layersSelectedNames.slice(0, -1);
		return layersSelectedNames;
	};

	var consulta = function(coordinate) {
		var layers = getCheckedLayers();
		if(coordinate.length==2){
			var wkt='POINT('+coordinate[0]+' ' +coordinate[1]+')';
		}else{
			var wkt = 'POLYGON((';
			for(var i=0;i<coordinate[0].length - 1;i++){
				wkt+=coordinate[0][i][0]+ ' ' + coordinate[0][i][1]+ ',';
			}
			wkt+=coordinate[0][0][0]+' '+coordinate[0][0][1]+'))'
		}
		PopupCenter('consulta.php?wkt='+wkt+'&capas='+layers,'Consulta',600,600);
		return;
	};

	$('#controls #navegacion').click(function(event) {
		var $this = $(this);
		if ($this.is(':checked')) {
			$('#controls #consulta')[0].checked = false;
			map.removeInteraction(selectInteraction);
			map.un('click',clickOnMap);
		} else {
			console.log('Aca destilde navegacion')
			$('#controls #consulta')[0].checked = true;
			map.addInteraction(selectInteraction);
			map.on('click',clickOnMap);
		};
	});

	$('#controls #consulta').click(function(event) {
		var $this = $(this);
		if ($this.is(':checked')) {
			$('#controls #navegacion')[0].checked = false;
			map.addInteraction(selectInteraction);
			map.on('click',clickOnMap);
		} else {
			console.log('Aca destilde consulta')
			$('#controls #navegacion')[0].checked = true;
			map.removeInteraction(selectInteraction);
			map.un('click',clickOnMap);
		}
	});
};
