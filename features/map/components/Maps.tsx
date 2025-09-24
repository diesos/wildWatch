import { useCurrentPosition } from "../hooks/useCurrentPosition";
import CreateMarkerModal from "./modals/createMarker";
import MarkerInfoModal from "./modals/MarkerInfoModal";
import Mapbox, { MapView } from "@rnmapbox/maps";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMarkers } from '../services/MarkerService';
import { Marker } from '@/types';


Mapbox.setAccessToken("pk.eyJ1Ijoic3JheW5hdWQtbGFtb2JpbGVyeSIsImEiOiJjbWZmdTRienQwb2F4MmtzYmprNWxieWZwIn0.mgySs3rW_6jA7hEKCF7ycw");

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: "tomato"
  },
  map: {
    flex: 1
  },
  pinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  customPin: {
    width: 40,
    height: 40,
  }
});


const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [ 3.1304834555508645, 50.65680201436652]
      },
      properties: {
        title: 'Mapbox',
        description: 'Washington, D.C.'
      }
    }
	  ]
};

const style = StyleSheet.create({
  marker: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  markerImage: {
    width: '100%',
    height: '100%',
  }
});



const Maps = () => {
  const coordinates = useCurrentPosition();

const mapRef = React.useRef(null);
const [pinData, setPinData] = React.useState(null);
const [modalVisible, setModalVisible] = React.useState(false);
const [selectedCoords, setSelectedCoords] = React.useState({ lat: 0, lng: 0 });
const [savedMarkers, setSavedMarkers] = React.useState<Marker[]>([]);
const [infoModalVisible, setInfoModalVisible] = React.useState(false);
const [selectedMarker, setSelectedMarker] = React.useState<Marker | null>(null);
const [editingMarker, setEditingMarker] = React.useState<Marker | null>(null);
const coordinateToArray = () => {
    return [coordinates.longitude, coordinates.latitude];
  };
 const getBboxAndFetch = useCallback(async () => {
      try {
          const data = geojson.features.length ? geojson : null;
          console.log('Setting pinData:', data);
		  console.log('Coordinates:', coordinates);
          setPinData(data);
          
          // Debug AsyncStorage
          const saved = await AsyncStorage.getItem('markers');
          console.log('Saved markers:', saved);
      } catch (error) {
          console.error(error);
      }
  }, []);

  // UseEffect pour récupérer les markers après création
  useEffect(() => {
    const loadMarkers = async () => {
      const markers = await getMarkers();
      setSavedMarkers(markers);
      console.log('Loaded markers:', markers);
      console.log('Number of markers:', markers.length);
    };
    
    loadMarkers();
  }, [modalVisible]); // Se déclenche quand la modale se ferme

  return (
    <View style={styles.page}>
      <View style={styles.container}>

        <MapView
		style={styles.map}
		ref={mapRef}
		onDidFinishLoadingMap={getBboxAndFetch}
		onPress={(event) => {
      console.log('MAP CLICKED!', event);
      // Récupérer les coordonnées du clic
      if ('coordinates' in event.geometry) {
        const coords = event.geometry.coordinates as [number, number];
        console.log('Clicked coordinates:', coords);
        setSelectedCoords({ lat: coords[1], lng: coords[0] });
        setModalVisible(true);
      }
    }}>
          <Mapbox.Camera
            centerCoordinate={coordinateToArray()}
            zoomLevel={13}
			animationMode={"flyTo"}
			animationDuration={2000}
          />
		   {savedMarkers.length > 0 && (
    <Mapbox.ShapeSource 
      id="saved-markers-source" 
      shape={{
        type: 'FeatureCollection',
        features: savedMarkers.map(marker => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [marker.longitude, marker.latitude]
          },
          properties: {
            id: marker.id,
            name: marker.name,
            date: marker.date
          }
        }))
      }}
      onPress={(event) => {
        const feature = event.features[0];
        if (feature && feature.properties) {
          const markerId = feature.properties.id;
          const marker = savedMarkers.find(m => m.id === markerId);
          if (marker) {
            setSelectedMarker(marker);
            setInfoModalVisible(true);
          }
        }
      }}
    >
      <Mapbox.SymbolLayer
        id="saved-markers-symbol"
        style={{
          iconImage: 'park-15',
          iconSize: 2.0,
          iconColor: '#FF6B35',
          iconAllowOverlap: true,
          iconIgnorePlacement: true,
          iconOpacity: 1,
          iconHaloColor: '#ffffff',
          iconHaloWidth: 2
        }}
      />
    </Mapbox.ShapeSource>
  )}
        </MapView>
        
        <CreateMarkerModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingMarker(null);
          }}
          latitude={editingMarker ? editingMarker.latitude : selectedCoords.lat}
          longitude={editingMarker ? editingMarker.longitude : selectedCoords.lng}
          editMarker={editingMarker || undefined}
        />
        
        <MarkerInfoModal
          visible={infoModalVisible}
          onClose={() => setInfoModalVisible(false)}
          marker={selectedMarker}
          onEdit={(marker) => {
            setEditingMarker(marker);
            setModalVisible(true);
          }}
          onDelete={() => {
            // Recharger les markers après suppression
            const loadMarkers = async () => {
              const markers = await getMarkers();
              setSavedMarkers(markers);
            };
            loadMarkers();
          }}
        />
      </View>
    </View>
  );
};

export default Maps;
