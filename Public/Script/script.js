const socket = io();


if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords;
        socket.emit('sendLocation', {latitude, longitude});
    }, (err)=>{
        console.error("Error getting location: ", err);
    },
    {
        enableHighAccuracy: true, // request high accuracy
        maximumAge: 0, // NoCaching - cache the position for 0 seconds
        timeout: 5000 // wait for 5 seconds before timing out
    }
);
}

const map = L.map('map').setView([0,0], 17); // Initialize the map with a view centered at [0,0] and zoom level 10

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution : "OpenStreetMap"
}).addTo(map) // Add OpenStreetMap tile layer to the map

const markers = {};

socket.on('receivedLocation', (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 12); // Set the map view to the received location 
    if(markers[id]){
        markers[id].setLetLng([latitude, longitude]); // Update the marker position if it already exists
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map); // Add a new marker to the map if it doesn't exist
    }
});

socket.on('user-disconnected',  (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]); 
        delete markers[id];
    }
})