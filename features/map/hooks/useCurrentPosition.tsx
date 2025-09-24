import * as Location from 'expo-location';
import * as React from "react";
import { Position } from '@/types';

export const useCurrentPosition = () => {
	const [currentPosition, setCurrentPosition] = React.useState<{
		latitude: number;
		longitude: number;
	}>({
		latitude: 0,
		longitude: 0
	});
	React.useEffect(() => {
		const getPosition = async () => {

				const { coords } = await Location.getCurrentPositionAsync({});
				setCurrentPosition({
					latitude: coords.latitude,
					longitude: coords.longitude
				});

		};
		getPosition();
	}, []);
	return currentPosition;
};
