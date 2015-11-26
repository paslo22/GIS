agregarDibujo = function() {

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

map.addLayer(vector);
draw = new ol.interaction.Draw({
      source: source,
      type: 'Point'
    });
    map.addInteraction(draw);

};