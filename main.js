$(document).ready(initializeApp);

var twitter = null;
var yelpData = null;
var weather = null;

function initializeApp () {
    tasks = new Tasks();
    map = new Maps();
    // weather = new Weather();

    clickHandler();
}

function clickHandler () {
    const mapCallbacks = {
        generateMarkerCallback: map.generateMarker,
        removeMarkersCallback: map.removeMarkers,
        zoomToLocationCallback: map.zoomToLocation,
        setCenterCallback: map.setCenter
    }

    $('.searchContainer').on('keypress', function (e) {
        var search = $('#searchInput').val().replace(' ', '_');
        var locationInput = $('#locationInput').val().replace(' ', '_');

        if (e.keyCode === 13 && search !== "") {
            yelpData = new YelpData (search, locationInput, mapCallbacks);
        }
    });

    $('.submitSearch').on('click', () => {
        var search = $('#searchInput').val().replace(' ', '_');
        var locationInput = $('#locationInput').val().replace(' ', '_');

        if (search !== "") {
            yelpData = new YelpData (search, locationInput, mapCallbacks);
        }
    });

    $('ul li:nth-child(1)').on('click', function() {
        if ($("#yelp").hasClass('hide')) {
            $("#yelp").removeClass('hide');
            $('ul li:nth-child(1)').addClass('active');
            $('.tasksContainer').addClass('hide');
            $('ul li:nth-child(2)').removeClass('active');
        }
    })

    $('ul li:nth-child(2)').on('click', function() {
        if ($('.tasksContainer').hasClass('hide')) {
            $('.tasksContainer').removeClass('hide').addClass('active');
            $('ul li:nth-child(2)').addClass('active');
            $('#yelp').addClass('hide');
            $('ul li:nth-child(1)').removeClass('active');
        }
    })
}
