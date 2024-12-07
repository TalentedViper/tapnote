import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {COUNTRY_ABBREVIATIONS} from './index';

// Replace with your Google Maps API Key
const GOOGLE_API_KEY = process.env['GOOGLE_API_KEY'];
Geocoder.init(GOOGLE_API_KEY);

// Helper function to get country abbreviation
const getAbbreviation = (countryName) => {
  return COUNTRY_ABBREVIATIONS[countryName] || 'Unknown';
};

// Request location permission on Android
const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS permissions handled via plist
};

// Get the user's current location
const getLocation = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

// Get the address and format it to "State, Country Abbreviation"
const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await Geocoder.from(latitude, longitude);

    if (response.results.length > 0) {
      const addressComponents = response.results[0].address_components;

      // Extract state/region
      const state = addressComponents.find((component) =>
        component.types.includes('administrative_area_level_1')
      )?.long_name;

      // Extract country
      const country = addressComponents.find((component) =>
        component.types.includes('country')
      )?.long_name;

      // Convert country name to abbreviation
      const countryAbbreviation = getAbbreviation(country);
      return { state: state || 'Unknown State', country: countryAbbreviation || 'Unknown Country' };
    } else {
      return { state: 'Unknown State', country: 'Unknown Country' };
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Error fetching location';
  }
};

// Fetch the location and set it to state
export const fetchLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      return false
    }

    // Get current location coordinates
    const { latitude, longitude } = await getLocation();
    // Get formatted address
    const { state, country } = await getAddressFromCoordinates(latitude, longitude);
    return { state, country}
  } catch (error) {
    console.error('Error fetching location:', error);
  }
};

