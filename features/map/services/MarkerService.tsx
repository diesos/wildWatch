import AsyncStorage from '@react-native-async-storage/async-storage';
import { Marker, MarkersArray } from '@/types';


export const saveMarkers = async (markersArray: MarkersArray) => {
	try {
		await AsyncStorage.setItem('markers', JSON.stringify(markersArray));
	} catch (error) {
		console.error('Error saving markers:', error);
	}
};

export const getMarkers = async () => {
	try {
		const saved = await AsyncStorage.getItem('markers');
		return saved ? JSON.parse(saved) : [];
	} catch (error) {
		console.error('Error retrieving markers:', error);
		return [];
	}
};

export const deleteMarker = async (markerId: string) => {
	try {
		const existingMarkers = await getMarkers();
		const updatedMarkers = existingMarkers.filter(marker => marker.id !== markerId);
		await saveMarkers(updatedMarkers);
	} catch (error) {
		console.error('Error deleting marker:', error);
	}
};

export const deleteAllMarkers = async () => {
	try {
		await AsyncStorage.removeItem('markers');
	} catch (error) {
		console.error('Error deleting all markers:', error);
	}
};
