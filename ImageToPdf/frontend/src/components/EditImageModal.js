import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export const EditImageModal = ({ visible, onClose, image, onSave }) => {
    const [currentImage, setCurrentImage] = useState(null);
    const [filter, setFilter] = useState('Normal'); // Normal, BW, Document
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (image) {
            setCurrentImage(image);
            setFilter(image.filter || 'Normal');
        }
    }, [image]);

    const handleRotate = async () => {
        if (!currentImage) return;
        setLoading(true);
        try {
            const result = await ImageManipulator.manipulateAsync(
                currentImage.uri,
                [{ rotate: 90 }],
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
            );
            setCurrentImage({ ...currentImage, uri: result.uri });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCrop = async () => {
        // Since we can't easily crop in-app without complex libraries, 
        // we use the native editor via ImagePicker
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true, // Enable native editor
                quality: 1,
            });

            if (!result.canceled) {
                setCurrentImage({ ...currentImage, uri: result.assets[0].uri });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFilter = () => {
        const filters = ['Normal', 'BW', 'Document'];
        const nextIndex = (filters.indexOf(filter) + 1) % filters.length;
        setFilter(filters[nextIndex]);
    };

    const handleSave = () => {
        onSave({ ...currentImage, filter });
        onClose();
    };

    if (!currentImage) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit Image</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.previewContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#FFF" />
                    ) : (
                        <Image
                            source={{ uri: currentImage.uri }}
                            style={[
                                styles.image,
                                filter === 'BW' && { tintColor: 'gray' }, // Simple preview for BW
                                // Document filter is complex to preview with simple styles, handled in PDF gen
                            ]}
                            resizeMode="contain"
                        />
                    )}
                    {filter !== 'Normal' && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterText}>{filter}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.toolButton} onPress={handleRotate}>
                        <MaterialIcons name="rotate-right" size={28} color="white" />
                        <Text style={styles.toolText}>Rotate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.toolButton} onPress={handleCrop}>
                        <MaterialIcons name="crop" size={28} color="white" />
                        <Text style={styles.toolText}>Crop</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.toolButton} onPress={toggleFilter}>
                        <MaterialIcons name="filter-b-and-w" size={28} color={filter !== 'Normal' ? '#4CAF50' : 'white'} />
                        <Text style={styles.toolText}>Filter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    cancelText: {
        color: 'white',
        fontSize: 16,
    },
    saveText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: 'bold',
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 40,
        paddingTop: 20,
        backgroundColor: '#1A1A1A',
    },
    toolButton: {
        alignItems: 'center',
    },
    toolText: {
        color: 'white',
        marginTop: 8,
        fontSize: 12,
    },
    filterBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    filterText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    }
});
