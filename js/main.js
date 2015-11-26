$(document).ready(function() {
	// Initialize the map
	map = new ol.Map({
		//get the div for the map
		target: 'map',
		//initialize the view with RSID
		view: new ol.View({
			projection: 'EPSG:4326',
			center:[-59, -39],
			zoom: 5
		})
	});

	getCapabilities();
	setInteractions();	
})

//This method is the first of a couple of methods that are trigger using the "then" function
getCapabilities = function() {
	//get the parser from Open Layer
	var parser = new ol.format.WMSCapabilities();
	//String for cababilities service
	var capabilitiesString = "http://localhost/cgi-bin/qgis_mapserv.fcgi?map="+ config['pathToQGS'] + config['QGSName']+"&service=WMS&REQUEST=getCapabilities"
	//function to get the capabality. This is just a Get to the above string
	$.ajax(capabilitiesString).then(function(response) {
		//use the parser to read the cabality, result is an array
		var result = parser.read(response);
		//return only the list of layers
		return result.Capability.Layer.Layer;
	}).then(function(capas) {
		addLayers(capas);
		addChecks(capas);
	})
};

//this method is called to add the layers to the map.
addLayers = function(capas) {
	//iterate over the array of layers and add everyone to the map
	$.each(capas,function(i) {
		//addLayer is a method from openLayers to add a layer to the map. visible = false to avoid perfomance issues.
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

//this method is called to add the list of checks on the "capas" div.
addChecks = function(capas) {
	//get the div
	container = $("#checks");
	//iterate over the layers array
	$.each(capas,function(i) {
		//starting a string to add html text to the container
		var output = '';
		output += '<div class="layer">';
		//add an input of type checkbox with the title of the layer as the id
		output += '<input type="checkbox" id="'+ capas[i].Title +'" />';
		//get the img from the capability and add it as the legend
		output += '<img src="'+ capas[i].Style[0].LegendURL[0].OnlineResource +'" />';
		output += '</div>';
		//append the string to the container
		container.append(output);
	});

	//get all the checkboxs inside the checks div
	var checkboxs = $('#checks input[type="checkbox"]');
	//iterate over the checkboxs to bind everyone to the function of set visible/invisible on the layer
	checkboxs.each(function(index, el) {
		//get the id of the checkbox with is the name of the layer
		var layerName = $(el).attr('id');
		//get the layer from the map filtering it by his name
		layer = map.getLayers().getArray().filter(function(a) {
			return (a.getProperties().title == layerName)
		});
		bindear(layer[0],el);
	});
};

bindear = function(layer, element) {
	//jQuery method to bind the event of change of the checkbox with a function
	$(element).change(function(event) {
		var checked = this.checked;
			if (checked !==layer.getVisible()) {
				layer.setVisible(checked);
			};
	});
};

//this function is called to set the function to toggle between navigation and consult
setInteractions = function() {
	//set the check of navigation on true by default
	$('#controls #navegacion')[0].checked=true;
	//set the check of consult on false by default
	$('#controls #consulta')[0].checked=false;
	$('#controls #insertar')[0].checked=false;


	//create the interaction for consult (el cuadrado azul)
	var selectInteraction = new ol.interaction.DragBox({
		condition: ol.events.condition.always,
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: [0, 0, 255, 1]
			})
		})
	});




	//(this is another way (no jQuery way) to) bind the interaction of consult to the method consulta.
	selectInteraction.on('boxend', function (evt) {
		consulta(this.getGeometry().getCoordinates());
	});

	//this method is used to bind the click event to the consulta method
	var clickOnMap = function(evt) {
		consulta(evt.coordinate);
	};

	//get the list of layers whos checked's attr is true
	var getCheckedLayers = function() {
		//get the checkbox checked
		var layersSelected = $('#checks input:checked');
		var layersSelectedNames = '';
		//iterate over the checks to get the names of the layers
		layersSelected.each(function(index, el) {
			layersSelectedNames+=el.id+';';
		});
		//cut the last char because there will be an extra ";"
		layersSelectedNames = layersSelectedNames.slice(0, -1);
		return layersSelectedNames;
	};

	//function to call the php function
	var consulta = function(coordinate) {
		//get an string of layers whos checked's attr is true
		var layers = getCheckedLayers();
		//find if the event is a point or a rectangle
		if(coordinate.length==2){
			//create the string to send to php
			var wkt='POINT('+coordinate[0]+' ' +coordinate[1]+')';
		}else{
			//create the string to send to php
			var wkt = 'POLYGON((';
			for(var i=0;i<coordinate[0].length - 1;i++){
				wkt+=coordinate[0][i][0]+ ' ' + coordinate[0][i][1]+ ',';
			}
			wkt+=coordinate[0][0][0]+' '+coordinate[0][0][1]+'))'
		}
		/* 	The class PopUpCenter is create in the archive popup.js and his function is to create a pop up and
			put it in the center of the screen.
			The first parameter is the php call. The second one is the name of the frame. The third and fourth are the
			width and height of the frame.
		*/
		PopupCenter('consulta.php?wkt='+wkt+'&capas='+layers,'Consulta',600,600);
		return;
	};

	var almacenarPunto = function(evt){
		$("#formVisita #coordenadas").attr("value", 'POINT('+evt.coordinate[0]+' ' +evt.coordinate[1]+')');
		$("#formVisita").modal();
	};

	var source = new ol.source.Vector();
	var vector = new ol.layer.Vector({
	  title: 'Visitas',
	  source: source,
	  style: new ol.style.Style({
	    fill: new ol.style.Fill({
	      color: 'rgba(255, 255, 255, 0.2)'
	    }),
	    stroke: new ol.style.Stroke({
	      color: '#ffcc33',
	      width: 2
	    }),
	    image: new ol.style.Circle({
	      radius: 7,
	      fill: new ol.style.Fill({
	        color: '#ffcc33'
	      })
	    })
	  })
	});

	var drawInteraction = new ol.interaction.Draw({
      source: source,
      type: 'Point'
    });

	//this is used to bind the click on the checkbox of navigation to toggle the navigation/consult
	$('#controls #navegacion').click(function(event) {
		var $this = $(this);
		if ($this.is(':checked')) {
			$('#controls #consulta')[0].checked = false;
			$('#controls #insertar')[0].checked = false;
			map.removeInteraction(selectInteraction);
			map.removeInteraction(drawInteraction);
			map.removeLayer(source.clear());
			map.un('click',clickOnMap);
			map.un('click',almacenarPunto);
		} else {
			$('#controls #navegacion')[0].checked = true;
		};
	});

	//this is used to bind the click on the checkbox of navigation to toggle the navigation/consult
	$('#controls #consulta').click(function(event) {
		var $this = $(this);
		if ($this.is(':checked')) {
			$('#controls #navegacion')[0].checked = false;
			$('#controls #insertar')[0].checked = false;
			map.addInteraction(selectInteraction);
			map.removeInteraction(drawInteraction);
			map.removeLayer(source.clear());
			map.on('click',clickOnMap);
			map.un('click',almacenarPunto);
		} else {
			$('#controls #consulta')[0].checked = true;
		}
	});

	$('#controls #insertar').click(function(event) {
	  	var $this = $(this);
	  	if ($this.is(':checked')) {
		    $('#controls #navegacion')[0].checked = false;
		    $('#controls #consulta')[0].checked = false;
		    map.addLayer(vector);
		    map.addInteraction(drawInteraction);
		    map.removeInteraction(selectInteraction);
		    map.un('click',clickOnMap);
		    map.on('click',almacenarPunto);
		} else {
		    $('#controls #insertar')[0].checked = true;
		}
	});
};
