import Mapbox from "@rnmapbox/maps";
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';


import * as Location from 'expo-location';

Mapbox.setAccessToken("pk.eyJ1Ijoic3JheW5hdWQtbGFtb2JpbGVyeSIsImEiOiJjbWZmdTRienQwb2F4MmtzYmprNWxieWZwIn0.mgySs3rW_6jA7hEKCF7ycw");

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
