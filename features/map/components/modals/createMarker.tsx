import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveMarkers, getMarkers } from '../../services/MarkerService';
import { Marker } from '@/types';

type CreateMarkerModalProps = {
  visible: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  editMarker?: Marker; // Pour le mode édition
};

const CreateMarkerModal = ({ visible, onClose, latitude, longitude, editMarker }: CreateMarkerModalProps) => {
  const [name, setName] = useState(editMarker?.name || '');
  const [img, setImg] = useState(editMarker?.img || '');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refus�e', 'Acc�s � la phototh�que requis');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });

    if (!result.canceled) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImg(base64);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refus�e', 'Acc�s � la cam�ra requis');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });

    if (!result.canceled) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImg(base64);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Ajouter une image',
      'Choisissez une option',
      [
        { text: 'Appareil photo', onPress: takePhoto },
        { text: 'Phototh�que', onPress: pickImage },
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom est requis');
      return;
    }

    try {
      const existingMarkers = await getMarkers();
      
      const newMarker = {
        id: Date.now().toString(),
        name: name.trim(),
        date: new Date().toISOString(),
        img: img,
        latitude,
        longitude
      };

      if (editMarker) {
        // Mode édition
        const updatedMarker = {
          ...editMarker,
          name: name.trim(),
          img: img,
        };
        
        const updatedMarkers = existingMarkers.map(marker => 
          marker.id === editMarker.id ? updatedMarker : marker
        );
        
        await saveMarkers(updatedMarkers);
        Alert.alert('Succès', 'Marker modifié avec succès');
      } else {
        // Mode création
        const updatedMarkers = [...existingMarkers, newMarker];
        await saveMarkers(updatedMarkers);
        Alert.alert('Succès', 'Marker créé avec succès');
      }

      setName('');
      setImg('');
      onClose();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le marker');
      console.error('Error saving marker:', error);
    }
  };

  const handleCancel = () => {
    setName('');
    setImg('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {editMarker ? 'Éditer le Marker' : 'Créer un Marker'}
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nom du marker"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image</Text>
            <TouchableOpacity style={styles.imageButton} onPress={showImageOptions}>
              <Text style={styles.imageButtonText}>
                {img ? 'Changer l\'image' : 'Ajouter une image'}
              </Text>
            </TouchableOpacity>
            {img && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: img }} style={styles.previewImage} />
              </View>
            )}
          </View>

          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>
              Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
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
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxWidth: 350,
    maxHeight: '65%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  imageButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  imageButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 10,
    alignItems: 'center',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  coordinatesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default CreateMarkerModal;