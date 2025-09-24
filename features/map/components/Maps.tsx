import { useCurrentPosition } from "../hooks/useCurrentPosition";
import CreateMarkerModal from "./modals/createMarker";
import MarkerInfoModal from "./modals/MarkerInfoModal";
import Mapbox, { MapView } from "@rnmapbox/maps";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, View, Image, Text, ActivityIndicator, Animated, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMarkers } from '../services/MarkerService';
import { Marker } from '@/types';
import * as Location from 'expo-location';


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
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  markersLoadingOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markersLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  animatedMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 20,
  },
  currentPositionMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  currentPositionIcon: {
    fontSize: 20,
    color: '#ffffff',
  }
});






const Maps = () => {
  const coordinates = useCurrentPosition();

const mapRef = React.useRef(null);
const [modalVisible, setModalVisible] = React.useState(false);
const [selectedCoords, setSelectedCoords] = React.useState({ lat: 0, lng: 0 });
const [savedMarkers, setSavedMarkers] = React.useState<Marker[]>([]);
const [infoModalVisible, setInfoModalVisible] = React.useState(false);
const [selectedMarker, setSelectedMarker] = React.useState<Marker | null>(null);
const [editingMarker, setEditingMarker] = React.useState<Marker | null>(null);
const [isLoadingMap, setIsLoadingMap] = React.useState(true);
const [isLoadingMarkers, setIsLoadingMarkers] = React.useState(false);
const [isSavingMarker, setIsSavingMarker] = React.useState(false);
const [animatedMarkers, setAnimatedMarkers] = React.useState<{[key: string]: Animated.Value}>({});
const coordinateToArray = () => {
    return [coordinates.longitude, coordinates.latitude];
  };
 const getBboxAndFetch = useCallback(async () => {
      try {
          // Vérifier les permissions de géolocalisation
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert(
              'Géolocalisation requise',
              'WildWatch a besoin d\'accéder à votre localisation pour fonctionner correctement. Veuillez autoriser l\'accès dans les paramètres.',
              [{ text: 'OK' }]
            );
            setIsLoadingMap(false);
            return;
          }
          
          console.log('Coordinates:', coordinates);
          
          // Debug AsyncStorage
          const saved = await AsyncStorage.getItem('markers');
          console.log('Saved markers:', saved);
          
          setIsLoadingMap(false);
      } catch (error) {
          console.error(error);
          setIsLoadingMap(false);
      }
  }, [coordinates]);

  // UseEffect pour récupérer les markers après création
  useEffect(() => {
    const loadMarkers = async () => {
      setIsLoadingMarkers(true);
      const markers = await getMarkers();
      
      // Créer des animations pour les nouveaux markers
      const newAnimations: {[key: string]: Animated.Value} = {};
      markers.forEach((marker: Marker) => {
        if (!animatedMarkers[marker.id]) {
          newAnimations[marker.id] = new Animated.Value(0);
        }
      });
      
      setSavedMarkers(markers);
      setAnimatedMarkers(prev => ({ ...prev, ...newAnimations }));
      
      // Animer les nouveaux markers un par un
      markers.forEach((marker: Marker, index: number) => {
        if (newAnimations[marker.id]) {
          setTimeout(() => {
            Animated.spring(newAnimations[marker.id], {
              toValue: 1,
              tension: 50,
              friction: 8,
              useNativeDriver: true,
            }).start();
          }, index * 200); // Délai de 200ms entre chaque marker
        }
      });
      
      setIsLoadingMarkers(false);
      console.log('Loaded markers:', markers);
      console.log('Number of markers:', markers.length);
    };
    
    loadMarkers();
  }, [modalVisible]); // Se déclenche quand la modale se ferme

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        {/* Indicateur de chargement de la carte */}
        {isLoadingMap && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Chargement de la carte...</Text>
          </View>
        )}
        
        {/* Indicateur de chargement des markers */}
        {isLoadingMarkers && (
          <View style={styles.markersLoadingOverlay}>
            <ActivityIndicator size="small" color="#FF6B35" />
            <Text style={styles.markersLoadingText}>Chargement des markers...</Text>
          </View>
        )}

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
          
          {/* Pin pour la position actuelle */}
          {coordinates.latitude !== 0 && coordinates.longitude !== 0 && (
            <Mapbox.PointAnnotation
              id="current-position"
              coordinate={[coordinates.longitude, coordinates.latitude]}
            >
              <View style={styles.currentPositionMarker}>
                <Text style={styles.currentPositionIcon}>📍</Text>
              </View>
            </Mapbox.PointAnnotation>
          )}
          
		   {savedMarkers.map((marker) => {
          const animationValue = animatedMarkers[marker.id] || new Animated.Value(1);
          return (
            <Mapbox.PointAnnotation
              key={marker.id}
              id={marker.id}
              coordinate={[marker.longitude, marker.latitude]}
              onSelected={() => {
                setSelectedMarker(marker);
                setInfoModalVisible(true);
              }}
            >
              <Animated.View
                style={[
                  styles.animatedMarker,
                  {
                    transform: [
                      {
                        scale: animationValue
                      }
                    ]
                  }
                ]}
              >
                <Text style={styles.markerIcon}>🏞️</Text>
              </Animated.View>
            </Mapbox.PointAnnotation>
          );
        })}
        </MapView>
        
        <CreateMarkerModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingMarker(null);
            setIsSavingMarker(false);
          }}
          latitude={editingMarker ? editingMarker.latitude : selectedCoords.lat}
          longitude={editingMarker ? editingMarker.longitude : selectedCoords.lng}
          editMarker={editingMarker || undefined}
          isSaving={isSavingMarker}
          onStartSaving={() => setIsSavingMarker(true)}
          onFinishSaving={() => setIsSavingMarker(false)}
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
