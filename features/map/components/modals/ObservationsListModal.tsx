import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Marker } from '@/types';

type ObservationsListModalProps = {
  visible: boolean;
  onClose: () => void;
  markers: Marker[];
  onMarkerSelect: (marker: Marker) => void;
};

const ObservationsListModal = ({ visible, onClose, markers, onMarkerSelect }: ObservationsListModalProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarkerPress = (marker: Marker) => {
    onMarkerSelect(marker);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>🌿 Mes Observations</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {markers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Aucune observation</Text>
              <Text style={styles.emptyText}>
                Tapez sur la carte pour créer votre première observation !
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
              {markers.map((marker) => (
                <TouchableOpacity
                  key={marker.id}
                  style={styles.markerItem}
                  onPress={() => handleMarkerPress(marker)}
                  activeOpacity={0.7}
                >
                  <View style={styles.markerContent}>
                    <View style={styles.markerInfo}>
                      <View style={styles.markerHeader}>
                        <Text style={styles.markerIcon}>🏞️</Text>
                        <Text style={styles.markerName}>{marker.name}</Text>
                      </View>
                      <Text style={styles.markerDate}>{formatDate(marker.date)}</Text>
                      <Text style={styles.markerCoords}>
                        {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                      </Text>
                    </View>
                    
                    {marker.img && (
                      <Image source={{ uri: marker.img }} style={styles.markerImage} />
                    )}
                    
                    <View style={styles.flyToIndicator}>
                      <Text style={styles.flyToText}>👆</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {markers.length} observation{markers.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a4d3a',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    maxHeight: 400,
  },
  markerItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  markerInfo: {
    flex: 1,
  },
  markerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  markerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  markerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  markerDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  markerCoords: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 12,
  },
  flyToIndicator: {
    marginLeft: 12,
    alignItems: 'center',
  },
  flyToText: {
    fontSize: 16,
    opacity: 0.7,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default ObservationsListModal;