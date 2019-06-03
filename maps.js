class Maps {
    constructor (zoomLevels) {
        this.center = {
            lat: 33.67, lng: -117.78
        };
        this.zoomLevels = {
            markers: 15,
            default: 11.5
        };
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: this.center,
            zoom: this.zoomLevels.default,
            gestureHandling: 'greedy'
        });

        this.markers = {};

        this.map.setCenter(this.center);

        this.lastResultClicked = null;

        this.generateMarker = this.generateMarker.bind(this);
        this.removeMarkers = this.removeMarkers.bind(this);
        // this.zoomToLocation = this.zoomToLocation.bind(this);
        this.setCenter = this.setCenter.bind(this);
    }
    
    generateMarker (resultInfo) {
        const content = `<h4 class="infowindow" href="#${resultInfo.id}">` + resultInfo.name+'</h4><p>' + resultInfo.address + '</p>';

      var infowindow = new google.maps.InfoWindow({
            content: content,
            map: this.map
        })

        var marker = new google.maps.Marker({
            position: { lat: resultInfo.coordinates.latitude, lng: resultInfo.coordinates.longitude },
            map: this.map,
            animation: google.maps.Animation.DROP
        });
      
        marker.addListener('click', function() {
            map.closeLastInfowindow(infowindow);

            this.map.setZoom(map.zoomLevels.markers);
            this.map.setCenter(this.getPosition());

            infowindow.open(map.map, this);

            infowindow.addListener('closeclick', () => {
                $(".save-btn").addClass("hide");
            })
          
            yelpData.scrollDiv = $(`div[href="#${resultInfo.id}"`);

            $(".save-btn").removeClass("hide");

            $('#yelp').animate({
                scrollTop: yelpData.scrollDiv.position().top
            }, 650)
        });

        this.markers[resultInfo.id] = {
            marker: marker,
            infowindow: infowindow,
            coordinates: {
                lat: resultInfo.coordinates.latitude,
                lng: resultInfo.coordinates.longitude
            }
        };
    }

    removeMarkers () {
        for (var key in this.markers) {
            this.markers[key].marker.setMap(null);
            delete this.markers[key];
        }
    }

    // zoomToLocation (resultID) {
    //     debugger;
    //     this.closeLastInfowindow(this.markers[resultID].infowindow);
    //     this.map.setZoom(this.zoomLevels.markers);
    //     this.map.setCenter(this.markers[resultID].coordinates);
    //     this.markers[resultID].infowindow.open(this.map, this.markers[resultID].marker);
    // }

    closeLastInfowindow (infowindow) {
        if (map.lastResultClicked !== null) {
            map.lastResultClicked.close();
        }

        map.lastResultClicked = infowindow;
    }

    setCenter (region) {
        this.map.setCenter({
            lat: region.latitude,
            lng: region.longitude
        })
    }
}
