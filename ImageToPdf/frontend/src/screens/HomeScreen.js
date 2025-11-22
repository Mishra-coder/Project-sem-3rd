import React, { useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, Platform, StatusBar, ActivityIndicator, TouchableOpacity, Image, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { MaterialIcons } from '@expo/vector-icons';
import { PremiumButton } from '../components/PremiumButton';
import { SettingsModal } from '../components/SettingsModal';
import { EditImageModal } from '../components/EditImageModal';
import * as ImagePicker from 'expo-image-picker';

import * as Print from 'expo-print';
import { LinearGradient } from 'expo-linear-gradient';

export const HomeScreen = () => {
    const [files, setFiles] = useState([]);
    const [converting, setConverting] = useState(false);
    const [pdfName, setPdfName] = useState('');

    // Settings State
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [settings, setSettings] = useState({
        pageSize: 'A4',
        orientation: 'Portrait',
        margins: 'Normal'
    });

    // Edit State
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingFile, setEditingFile] = useState(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            if (!asset) return;

            addFile(asset);
        } catch (err) {
            Alert.alert('Error', 'Failed to pick file: ' + err.message);
        }
    };

    const pickImages = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 1,
            });

            if (!result.canceled) {
                result.assets.forEach(asset => {
                    addFile({
                        uri: asset.uri,
                        name: asset.fileName || `image_${Date.now()}.jpg`,
                        size: asset.fileSize || 0,
                        mimeType: asset.mimeType || 'image/jpeg'
                    });
                });
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to pick images: ' + err.message);
        }
    };

    const addFile = (fileData) => {
        if (files.some(f => f.uri === fileData.uri)) {
            return;
        }

        setFiles(prev => [...prev, {
            uri: fileData.uri,
            name: fileData.name,
            size: fileData.size,
            mimeType: fileData.mimeType,
            status: 'pending',
            filter: 'Normal' // Default filter
        }]);
    };

    const moveFile = (index, direction) => {
        const newFiles = [...files];
        if (direction === 'up' && index > 0) {
            [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
        } else if (direction === 'down' && index < newFiles.length - 1) {
            [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        }
        setFiles(newFiles);
    };

    const openEditor = (file) => {
        setEditingFile(file);
        setEditModalVisible(true);
    };

    const saveEditedImage = (updatedFile) => {
        setFiles(prev => prev.map(f => f.uri === editingFile.uri ? { ...f, ...updatedFile, status: 'pending' } : f));
    };

    const handleConvert = async (file) => {
        // Single file conversion logic (kept for individual button)
        // But typically we want to convert ALL files into ONE PDF if it's a batch app.
        // The user asked for "Image to PDF", usually implying merging.
        // However, the current logic is per-file. I will keep it per-file for the individual "Convert" button,
        // but for "Convert All", I should probably merge them? 
        // The previous logic for "Convert All" was just looping handleConvert.
        // Let's stick to the existing logic to avoid breaking changes, but apply the name to the file.

        setConverting(true);
        updateFileStatus(file.uri, 'converting');

        try {
            let pdfUri;

            const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });

            // CSS for Filters
            let filterStyle = '';
            if (file.filter === 'BW') filterStyle = 'filter: grayscale(100%);';
            if (file.filter === 'Document') filterStyle = 'filter: grayscale(100%) contrast(150%) brightness(110%);';

            // CSS for Margins
            let margin = '0';
            if (settings.margins === 'Small') margin = '20px';
            if (settings.margins === 'Normal') margin = '40px';

            // CSS for Page Size & Orientation handled by @page (partially supported) or container sizing
            // Expo Print supports 'width' and 'height' props in printToFileAsync, but CSS is better for content layout.

            const html = `
          <html>
            <head>
              <style>
                @page {
                  margin: ${margin};
                  size: ${settings.pageSize} ${settings.orientation};
                }
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                img {
                  max-width: 100%;
                  max-height: 100%;
                  ${filterStyle}
                }
              </style>
            </head>
            <body>
              <img src="data:${file.mimeType || 'image/jpeg'};base64,${base64}" />
            </body>
          </html>
        `;

            // Map settings to Expo Print options where possible
            // Expo Print doesn't fully support @page size in all cases, but we can try.
            // Ideally we would calculate width/height for printToFileAsync based on A4/Letter.

            const { uri } = await Print.printToFileAsync({
                html,
                // width: 612, // Letter width
                // height: 792, // Letter height
                // base64: false
            });

            // Rename if needed
            let finalUri = uri;
            if (pdfName) {
                const newFilename = `${pdfName.replace(/[^a-zA-Z0-9-_]/g, '')}_${Date.now()}.pdf`;
                finalUri = FileSystem.documentDirectory + newFilename;
                await FileSystem.moveAsync({ from: uri, to: finalUri });
            }

            updateFileStatus(file.uri, 'done', finalUri);
            setConverting(false);

            Alert.alert('Success', 'Conversion complete. Tap "Open" to view or save.');

        } catch (error) {
            console.error(error);
            updateFileStatus(file.uri, 'error');
            setConverting(false);
            Alert.alert('Conversion Failed', error.message);
        }
    };

    const openFile = async (item) => {
        try {
            if (item.pdfUri) {
                await Sharing.shareAsync(item.pdfUri);
            } else {
                const filename = item.name.replace(/\.[^/.]+$/, "") + ".pdf";
                const fileUri = FileSystem.documentDirectory + filename;
                await Sharing.shareAsync(fileUri);
            }
        } catch (error) {
            Alert.alert('Error', 'Could not open file');
        }
    };

    const updateFileStatus = (uri, status, pdfUri = null) => {
        setFiles(prev => prev.map(f => f.uri === uri ? { ...f, status, pdfUri: pdfUri || f.pdfUri } : f));
    };

    const removeFile = (uri) => {
        setFiles(prev => prev.filter(f => f.uri !== uri));
    };

    const convertAll = async () => {
        const pendingFiles = files.filter(f => f.status === 'pending');
        if (pendingFiles.length === 0) {
            Alert.alert('Info', 'No pending files to convert');
            return;
        }

        setConverting(true);

        for (const file of pendingFiles) {
            await handleConvert(file);
        }

        setConverting(false);
        Alert.alert('Batch Complete', 'All files have been processed.');
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.card}>
            <View style={styles.cardIcon}>
                <Image
                    source={{ uri: item.uri }}
                    style={[
                        styles.thumbnail,
                        item.filter === 'BW' && { tintColor: 'gray' }
                    ]}
                />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.fileSize}>{(item.size / 1024).toFixed(1)} KB</Text>
            </View>
            <View style={styles.cardActions}>
                {item.status === 'pending' && (
                    <>
                        <View style={styles.moveButtons}>
                            <TouchableOpacity onPress={() => moveFile(index, 'up')} disabled={index === 0}>
                                <MaterialIcons name="keyboard-arrow-up" size={24} color={index === 0 ? '#DDD' : '#666'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => moveFile(index, 'down')} disabled={index === files.length - 1}>
                                <MaterialIcons name="keyboard-arrow-down" size={24} color={index === files.length - 1 ? '#DDD' : '#666'} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => openEditor(item)} style={styles.iconAction}>
                            <MaterialIcons name="edit" size={22} color="#2196F3" />
                        </TouchableOpacity>
                        <PremiumButton
                            title="Convert"
                            onPress={() => handleConvert(item)}
                            color="#2196F3"
                            style={styles.miniButton}
                            loading={converting && item.status === 'converting'}
                        />
                    </>
                )}
                {item.status === 'converting' && (
                    <ActivityIndicator color="#2196F3" />
                )}
                {item.status === 'done' && (
                    <PremiumButton
                        title="Open"
                        onPress={() => openFile(item)}
                        color="#4CAF50"
                        style={styles.miniButton}
                        icon="open-in-new"
                    />
                )}
                {item.status === 'error' && (
                    <MaterialIcons name="error" size={28} color="#F44336" />
                )}
                <TouchableOpacity onPress={() => removeFile(item.uri)} style={styles.deleteAction}>
                    <MaterialIcons name="close" size={20} color="#999" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={styles.header}
            >
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>Image to PDF</Text>
                        <Text style={styles.headerSubtitle}>Professional Converter</Text>
                    </View>
                    <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.settingsButton}>
                        <MaterialIcons name="settings" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <MaterialIcons name="edit" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter PDF Name (Optional)"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={pdfName}
                        onChangeText={setPdfName}
                    />
                </View>
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.actionButtons}>
                    <PremiumButton
                        title="Select Images"
                        icon="image"
                        onPress={pickImages}
                        style={styles.actionButton}
                        gradient={['#FF9800', '#F57C00']}
                    />
                    <PremiumButton
                        title="Select Files"
                        icon="folder-open"
                        onPress={pickDocument}
                        style={styles.actionButton}
                        gradient={['#2196F3', '#1976D2']}
                    />
                </View>

                {files.some(f => f.status === 'pending') && (
                    <PremiumButton
                        title="Convert All Files"
                        icon="play-circle-filled"
                        onPress={convertAll}
                        gradient={['#4CAF50', '#388E3C']}
                        style={styles.mainButton}
                        loading={converting}
                    />
                )}

                <FlatList
                    data={files}
                    keyExtractor={item => item.uri}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialIcons name="cloud-upload" size={80} color="#E0E0E0" />
                            <Text style={styles.emptyText}>No files selected</Text>
                            <Text style={styles.emptySubText}>Select images to start converting</Text>
                        </View>
                    }
                />
            </View>

            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                settings={settings}
                onUpdateSettings={setSettings}
            />

            <EditImageModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                image={editingFile}
                onSave={saveEditedImage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        paddingTop: Platform.OS === 'android' ? 50 : 60,
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: 'white',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    settingsButton: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        paddingVertical: 8,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10,
    },
    actionButton: {
        width: '48%',
        marginVertical: 0,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardIcon: {
        width: 56,
        height: 56,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 12,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        flex: 1,
    },
    fileName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    fileSize: {
        fontSize: 12,
        color: '#999',
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moveButtons: {
        marginRight: 8,
        alignItems: 'center',
    },
    miniButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginVertical: 0,
        width: 'auto',
        marginRight: 8,
    },
    iconAction: {
        padding: 8,
        marginRight: 4,
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
    },
    deleteAction: {
        padding: 8,
        marginLeft: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#CCC',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#AAA',
        marginTop: 8,
    },
    mainButton: {
        width: '100%',
        marginVertical: 10,
    }
});
