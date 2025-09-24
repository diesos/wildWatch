import * as Location from 'expo-location';
import { PermissionStatus } from 'expo-location';
import { router } from 'expo-router';
import * as React from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { Maps } from "../features/map";
import { getMarkers } from '../features/map/services/MarkerService';
import { Marker } from '@/types';
import ObservationsListModal from '../features/map/components/modals/ObservationsListModal';

export default function LocationScreen() {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [markers, setMarkers] = React.useState<Marker[]>([]);
  const [observationsModalVisible, setObservationsModalVisible] = React.useState(false);
  const mapRef = React.useRef<any>(null);

  React.useEffect(() => {
    const checkPermissions = async () => {
      try {
        setIsLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        setIsAuthorized(status === PermissionStatus.GRANTED);
      } catch (error) {
        console.error('Error requesting location permissions:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkPermissions();
  }, []);

  const handleRetryPermission = async () => {
    setIsLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === PermissionStatus.GRANTED) {
      setIsAuthorized(true);
    } else {
      Alert.alert(
        'Permission requise',
        'WildWatch a besoin d\'accéder à votre localisation pour fonctionner correctement. Veuillez activer la géolocalisation dans les paramètres de votre appareil.',
        [{ text: 'OK' }]
      );
    }
    setIsLoading(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  const loadMarkers = async () => {
    try {
      const savedMarkers = await getMarkers();
      setMarkers(savedMarkers);
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  };

  const handleObservationsClick = async () => {
    await loadMarkers();
    setObservationsModalVisible(true);
  };

  const handleCurrentPositionClick = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        // Call flyToCurrentPosition if the map reference is available
        if (mapRef.current && mapRef.current.flyToCurrentPosition) {
          mapRef.current.flyToCurrentPosition();
        } else {
          Alert.alert('Position actuelle', 'Navigation vers votre position...');
        }
      } else {
        Alert.alert('Permission requise', 'Accès à la localisation nécessaire');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'obtenir la position actuelle');
    }
  };

  // Load markers when authorized
  React.useEffect(() => {
    if (isAuthorized) {
      loadMarkers();
    }
  }, [isAuthorized]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.loadingContainer}>
          <Text style={styles.logo}>🌿</Text>
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
          <Text style={styles.loadingText}>Demande d'autorisation...</Text>
          <Text style={styles.loadingSubtext}>
            WildWatch souhaite accéder à votre localisation
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Permission denied state
  if (isAuthorized === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.deniedContainer}>
          {/* Header */}
          <View style={styles.deniedHeader}>
            <Text style={styles.deniedIcon}>🚫</Text>
            <Text style={styles.deniedTitle}>Accès à la localisation refusé</Text>
            <Text style={styles.deniedSubtext}>
              WildWatch a besoin de votre localisation pour vous aider à documenter vos observations dans la nature.
            </Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefit}>
              <Text style={styles.benefitIcon}>📍</Text>
              <Text style={styles.benefitText}>
                Enregistrer automatiquement la position de vos découvertes
              </Text>
            </View>
            <View style={styles.benefit}>
              <Text style={styles.benefitIcon}>🗺️</Text>
              <Text style={styles.benefitText}>
                Naviguer sur la carte et explorer votre environnement
              </Text>
            </View>
            <View style={styles.benefit}>
              <Text style={styles.benefitIcon}>🔒</Text>
              <Text style={styles.benefitText}>
                Vos données restent privées et stockées localement
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRetryPermission}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>🔄 Réessayer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>← Retour à l'accueil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Authorized state - show map
  return (
    <SafeAreaView style={styles.mapContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1a4d3a" />
      
      {/* Header with instructions and back button */}
      <View style={styles.mapHeader}>
        <TouchableOpacity 
          style={styles.backButtonMap}
          onPress={handleGoBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>🌿 WildWatch</Text>
          <Text style={styles.instructionsText}>
            Tapez n'importe où sur la carte pour créer une observation
          </Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Map container - takes half of remaining space */}
      <View style={styles.mapWrapper}>
        <Maps ref={mapRef} />
      </View>

      {/* First divider */}
      <View style={styles.divider} />

      {/* Bottom section - takes half of screen */}
      <View style={styles.bottomSection}>
        <Text style={styles.legendTitle}>🌿 Légende</Text>
        <View style={styles.legendContainer}>
          <TouchableOpacity 
            style={styles.legendItem}
            onPress={handleObservationsClick}
            activeOpacity={0.7}
          >
            <Text style={styles.legendIcon}>🏞️</Text>
            <Text style={styles.legendText}>Mes observations ({markers.length})</Text>
            <Text style={styles.clickIndicator}>👆</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.legendItem}
            onPress={handleCurrentPositionClick}
            activeOpacity={0.7}
          >
            <Text style={styles.legendIcon}>📍</Text>
            <Text style={styles.legendText}>Ma position actuelle</Text>
            <Text style={styles.clickIndicator}>👆</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Second divider */}
      <View style={styles.divider} />
      
      <ObservationsListModal
        visible={observationsModalVisible}
        onClose={() => setObservationsModalVisible(false)}
        markers={markers}
        onMarkerSelect={(marker) => {
          setObservationsModalVisible(false);
          // Call flyToMarker if the map reference is available
          if (mapRef.current && mapRef.current.flyToMarker) {
            mapRef.current.flyToMarker(marker);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#1a4d3a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 64,
    marginBottom: 24,
  },
  loader: {
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  deniedContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  deniedHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
  deniedIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  deniedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  deniedSubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  benefitsContainer: {
    marginVertical: 40,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  benefitText: {
    fontSize: 14,
    color: '#444444',
    flex: 1,
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(26, 77, 58, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonMap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonIcon: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  instructionsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 12,
    color: '#e8f5e8',
    textAlign: 'center',
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
  mapWrapper: {
    flex: 1,
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'rgba(26, 77, 58, 0.8)',
    padding: 20,
    justifyContent: 'center',
  },
  legendTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  legendContainer: {
    gap: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  legendIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  legendText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    flex: 1,
  },
  clickIndicator: {
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.7,
  },
});
