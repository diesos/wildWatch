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

export default function LocationScreen() {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

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

      <Maps />
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
});
