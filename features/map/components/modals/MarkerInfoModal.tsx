import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, Alert, TouchableWithoutFeedback } from 'react-native';
import { Marker } from '@/types';
import { deleteMarker } from '../../services/MarkerService';

type MarkerInfoModalProps = {
  visible: boolean;
  onClose: () => void;
  marker: Marker | null;
  onEdit?: (marker: Marker) => void;
  onDelete?: () => void;
};

const MarkerInfoModal = ({ visible, onClose, marker, onEdit, onDelete }: MarkerInfoModalProps) => {
  if (!marker) return null;

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

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le marker',
      `Êtes-vous sûr de vouloir supprimer "${marker.name}" ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMarker(marker.id);
              onClose();
              onDelete?.();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le marker');
            }
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{marker.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {marker.img && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: marker.img }} style={styles.image} />
            </View>
          )}

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{formatDate(marker.date)}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Coordonnées</Text>
              <Text style={styles.value}>
                {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>ID</Text>
              <Text style={styles.value}>{marker.id}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {onEdit && (
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => {
                  onEdit(marker);
                  onClose();
                }}
              >
                <Text style={styles.editButtonText}>✏️ Éditer</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>🗑️ Supprimer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.okButton} onPress={onClose}>
              <Text style={styles.okButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxWidth: 350,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
  imageContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  okButton: {
    backgroundColor: '#8E8E93',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  okButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default MarkerInfoModal;