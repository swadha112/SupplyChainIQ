// services/geoService.js

const axios = require('axios');

const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

// Function to get the coordinates (lat, lng) of a destination by name
async function getCoordinates(destinationName) {
  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationName)}&key=${googleMapsApiKey}`;
  
  try {
    const response = await axios.get(geocodingUrl);
    const location = response.data.results[0].geometry.location; // Extract the lat and lng

    return { lat: location.lat, lng: location.lng };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw new Error('Failed to fetch coordinates from Google Maps Geocoding API');
  }
}

// Function to get the nearest source based on destination name
async function getNearestSource(destinationName, plantSources) {
  try {
    // Get destination coordinates using Geocoding API
    const destinationCoordinates = await getCoordinates(destinationName);
    const destinationString = `${destinationCoordinates.lat},${destinationCoordinates.lng}`;

    // Prepare source locations for the request
    const sourcesString = plantSources.map(source => `${source.location.lat},${source.location.lng}`).join('|');

    // Google Maps Distance Matrix API endpoint
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${sourcesString}&destinations=${destinationString}&key=${googleMapsApiKey}`;

    const response = await axios.get(apiUrl);

    // Find the nearest source based on the shortest distance
    const distances = response.data.rows.map((row, index) => ({
      source: plantSources[index],
      distance: row.elements[0].distance.value // Distance in meters
    }));

    // Sort the sources by distance (ascending)
    const nearestSource = distances.sort((a, b) => a.distance - b.distance)[0].source;

    return nearestSource;
  } catch (error) {
    console.error('Error fetching distances:', error);
    throw new Error('Failed to fetch distances from Google Maps API');
  }
}

module.exports = {
  getCoordinates,
  getNearestSource,
};
