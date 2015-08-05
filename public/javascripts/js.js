var socket = io();
var map;
var centered = false;


function initialize() {
	
	var mapOptions = {
		center: new google.maps.LatLng(50.0357622, 8.3318154),
		disableDefaultUI: true,
		minZoom: 2,
		zoom: 4
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}


google.maps.event.addDomListener(window, 'load', initialize);

socket.on('tweet', function(tweet){

	var tweedeckTemplate = document.getElementById("tweet-template").textContent;
	var tweedeckHtml = Mustache.render(tweedeckTemplate, tweet);	
	var tweetdeckBookmark = document.createElement("div");
    tweetdeckBookmark.innerHTML = tweedeckHtml;
	document.getElementById("tweetFrame").insertBefore(tweetdeckBookmark, document.getElementById("tweetFrame").firstChild);
	
	//MAP
	var myLatlng = new google.maps.LatLng(tweet.latitude, tweet.longitude);
	
	var infowindowTemplate = document.getElementById("infowindow-template").textContent;
	var infowindowHtml = Mustache.render(infowindowTemplate, tweet);
	var infowindowBookmark = document.createElement("div");
	infowindowBookmark.innerHTML = infowindowHtml;

	var infowindow = new InfoBox({
         content: infowindowBookmark,
         disableAutoPan: true,
         maxWidth: 250,
         pixelOffset: new google.maps.Size(-140, 0),
         zIndex: null,
         boxStyle: {
            background: "url('/images/tipbox.gif') no-repeat",
            opacity: 0.75,
            width: "280px"
        },
        closeBoxMargin: "12px 4px 2px 2px",
        closeBoxURL: "/images/close.gif",
        infoBoxClearance: new google.maps.Size(1, 1)
    });

	
	var marker = new google.maps.Marker({
      position: myLatlng,
	  animation: google.maps.Animation.DROP,
	  icon: '../images/love.gif',
      map: map,
      title: tweet.name
    });
	if (document.getElementById("cbAutopan").checked && centered === false) {
		map.setCenter(myLatlng);
		//delay for next autopan so it does not go crazy
		centered = true;
		setTimeout(function(){ centered = false; }, 1000);
	}
	infowindow.open(map, marker);
	google.maps.event.addListener(marker, "click", function() {
		infowindow.open(map,marker);
	});
	tweetdeckBookmark.addEventListener("mouseover", function() {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}, false);
	tweetdeckBookmark.addEventListener("mouseout", function() {
		marker.setAnimation(null);
	}, false);
	setTimeout(function(){ infowindow.close(); }, 5000);
});