
            
var D = {
    
    "map" : {},
    "locate_button" : {},
    "locate_point" : {},
    "init" : function(){  
            document.getElementsByTagName("title")[0].innerHTML=config.name;
            D.map = L.map('map',{maxBounds:config.maxBounds}).setView(config.center, 13);
            /* good theme : 91948 14188  day : 104054 104398 night :91948*/ 
            //L.tileLayer('http://{s}.tile.cloudmade.com/9b41b832330d45e38a1a2e502878e677/104417/256/{z}/{x}/{y}.png', {
            L.tileLayer('http://dae.sapk.fr/api/tile.php?z={z}&x={x}&y={y}', {
                attribution: ' ',
                maxZoom: config.maxZoom,
                minZoom: config.minZoom
            }).addTo(D.map);
            
            var LocateControl = L.Control.extend({
                options: {
                    position: 'topright'
                },
                onAdd: function (map) {
                    D.locate_button = L.DomUtil.create('div', 'locate-control leaflet-bar');
                    //container.innerHTML='<a class="leaflet-disabled" href="#" title="Zoom in"><img src="img/locate.png"/></a>';
                    D.locate_button.innerHTML='<a id="locate" href="#" title="Locate"><img src="img/locate.png"/></a>';
                    D.locate_button.onclick = function(){
                        D.locate_button.innerHTML='<a id="locate" href="#" title="Locate"><img src="img/locate.png"/></a>';
                        //D.map.locate({setView: true,watch: true, enableHighAccuracy : true});
                        config.locate_enable=true;
                        D.map.panTo(D.locate_point.getLatLng());
                    };
                    return D.locate_button;
                }
            });
            
            D.map.addControl(new LocateControl());
            D.locate_point = L.marker([0,0],{icon:D.icons.point}).addTo(D.map);
            D.locate_circle = L.circle([0,0], 0, {color: '#fff', fillColor: '#f55',fillOpacity: 0.5}).addTo(D.map);
            
            D.map.on('locationfound', function(l) {
                console.log(l);
                //if(D.locate_point.hasOwnProperty('options()'))
                if((new L.LatLngBounds(config.maxBounds)).contains(l.latlng)){
                    if(config.locate_enable){
                        //D.map.panTo(l.latlng);
                        D.map.fitBounds(l.bounds)
                    }
                    
                    D.locate_circle.setLatLng(l.latlng).setRadius(l.accuracy);
                    D.locate_point.setLatLng(l.latlng);
                }
                else{
                    console.log("not in bounds");
                    config.locate_enable=false;
                    //D.map.stopLocate();
                    D.map.panTo(config.center);
                }
                    //D.map.panTo(l.latlng);
                //else
                 //   D.locate_point = L.marker(l.latlng,{icon:D.icons.point}).addTo(D.map);

            });
            
            D.map.on('locationerror', function(e) {
                alert("Impossible d'utiliser votre position GPS.")
                config.locate_enable=false;
                D.map.stopLocate();
                //D.map.panTo({lat:44.842238,lng:-0.580269});
            });
            
            D.map.locate({setView: false,watch: true, enableHighAccuracy : true});
            /*
            D.map.on('zoomstart', function(e) {
                D.map.stopLocate();
                D.locate_button.innerHTML='<a id="locate" class="leaflet-disabled" href="#" title="Zoom in"><img src="/img/locate.png"/></a>';
                  
            });
            */
            D.map.on('dragstart', function(e) {
                //D.map.stopLocate();
                config.locate_enable=false;
                D.locate_button.innerHTML='<a id="locate" class="leaflet-disabled" href="#" title="Zoom in"><img src="img/locate.png"/></a>';
                  
            });
            //D.map.on('load', function(e) {            
                
            //});
            
            
            for (var i in config.points) {
                console.log(config.points[i]);
                L.marker(config.points[i].position,{icon:D.icons.defib ,title:config.points[i].title,riseOnHover:true}).addTo(D.map).bindPopup(config.points[i].html);;
            }
    },
    "icons": {
        "point" :  L.icon({iconUrl: 'img/point.png',iconSize:[20, 20], iconAnchor:   [10, 10],popupAnchor:  [-0, -10]}),
        "defib" :  L.icon({iconUrl: config.img, iconSize:[40, 40], iconAnchor:   [20, 20],popupAnchor:  [-0, -20]})
        
    }
    
};

D.init();
