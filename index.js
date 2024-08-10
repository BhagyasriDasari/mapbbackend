const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS
const app = express();
const port = 5000;

const googleMapsApiKey = 'AIzaSyCjqFTzy-Z7KP5FmJ_E3vd4Vs5mdspMR7M'; 

// Enable CORS for all origins (You can restrict it to specific origins as needed)
app.use(cors());

// Function to get directions from Google Maps API
const getRoute = async (origin, destination) => {
  const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${googleMapsApiKey}`;
  
  try {
    const response = await axios.get(directionsUrl);
    if (response.data.status !== 'OK') {
      throw new Error(`Error fetching directions: ${response.data.status}`);
    }
    const steps = response.data.routes[0]?.legs[0]?.steps || [];
    const route = steps.map(step => ({
      latitude: step.start_location.lat,
      longitude: step.start_location.lng
    }));
    return route;
  } catch (error) {
    console.error('Error fetching directions:', error);
    return [];
  }
};

// Endpoint to get vehicle location based on date query
app.get('/vehicle-location', async (req, res) => {
  const date = req.query.date || 'today'; // Default to 'today' if no date is provided

  let vehicle = [];
  if (date === 'yesterday') {
    vehicle = await getRoute('37.7749,-122.4194', '37.7799,-122.4294');
  } else if (date === 'last month') {
    vehicle = await getRoute('38.7749,-121.4194', '38.7799,-121.4294');
  } else {
    vehicle = await getRoute('37.7749,-122.4194', '37.7799,-122.4294'); // Default route
  }

  res.json(vehicle);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
