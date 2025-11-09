import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ToastAndroid, Platform, PermissionsAndroid } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [files, setFiles] = useState([]);
  const BACKEND_URL = process.env.REACT_APP_API_URL;

  const pickWordFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (result.canceled === true || result.type === 'cancel') {
        if (Platform.OS === 'android') ToastAndroid.show('File selection cancelled', ToastAndroid.SHORT);
        else Alert.alert('Cancelled', 'File selection was cancelled');
        return;
      }

      let fileObj = null;
      if (Array.isArray(result.assets) && result.assets.length > 0) {
        const a = result.assets[0];
        fileObj = { uri: a.uri, name: a.name || a.fileName || (a.uri && a.uri.split('/').pop()), size: a.size };
      } else if (result.type === 'success' || result.uri) {
        const uri = result.uri;
        const name = result.name || (uri && uri.split('/').pop());
        fileObj = { uri, name };
      }

      if (!fileObj) {
        Alert.alert('Pick error', 'Could not interpret the picked file.');
        return;
      }

      const name = fileObj.name || '';
      const ext = name.split('.').pop()?.toLowerCase() || '';
      const allowed = ['doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'mp4'];

      if (!allowed.includes(ext)) {
        if (Platform.OS === 'android') ToastAndroid.show('Please select a supported file (.doc/.docx/.pdf/.jpg/.png/.mp4)', ToastAndroid.LONG);
        else Alert.alert('Invalid file', 'Please select a supported file (.doc/.docx/.pdf/.jpg/.png/.mp4)');
        return;
      }

      if (!files.find(f => f.uri === fileObj.uri)) {
        setFiles((prevFiles) => [...prevFiles, fileObj]);
        if (Platform.OS === 'android') ToastAndroid.show(`${fileObj.name} selected`, ToastAndroid.SHORT);
        else Alert.alert('File selected', fileObj.name);
      } else {
        if (Platform.OS === 'android') ToastAndroid.show('File already selected', ToastAndroid.SHORT);
        else Alert.alert('Info', 'File already selected');
      }
    } catch (error) {
      Alert.alert('Error', 'File picking failed: ' + (error?.message || error));
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        if (Platform.OS === 'android') ToastAndroid.show(`Gallery permission: ${status}`, ToastAndroid.LONG);
        else Alert.alert('Permission required', `Permission to access the gallery is required (status=${status}).`);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
        selectionLimit: 1,
        includeBase64: true,
      });
      if (result.canceled || result.cancelled) {
        if (Platform.OS === 'android') ToastAndroid.show('Gallery cancelled — opening Files picker as fallback', ToastAndroid.SHORT);
        else Alert.alert('Cancelled', 'Gallery selection was cancelled — opening Files picker as fallback');

        try {
          const doc = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
          if (doc.type === 'success') {
            const uri = doc.uri;
            const name = doc.name || (uri && uri.split('/').pop());
            const fileObj = { uri, name };
            if (!files.find(f => f.uri === uri)) setFiles(prev => [...prev, fileObj]);
            return;
          } else {
            return;
          }
        } catch (e) {
          return;
        }
      }

      const asset = result.assets ? result.assets[0] : result;
      const uri = asset.uri;
      const name = asset.fileName || uri.split('/').pop();
      const base64 = asset.base64;

      const fileObj = { uri, name, base64 };
      if (!files.find(f => f.uri === uri)) {
        setFiles(prev => [...prev, fileObj]);
        if (Platform.OS === 'android') ToastAndroid.show(`${name} selected from gallery`, ToastAndroid.SHORT);
        else Alert.alert('File selected', name);
      } else {
        if (Platform.OS === 'android') ToastAndroid.show('File already selected', ToastAndroid.SHORT);
        else Alert.alert('Info', 'File already selected');
      }
    } catch (err) {
      Alert.alert('Error', 'Gallery pick failed: ' + (err?.message || err));
    }
  };

  const pickFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        if (Platform.OS === 'android') ToastAndroid.show(`Camera permission: ${status}`, ToastAndroid.LONG);
        else Alert.alert('Permission required', `Permission to access the camera is required (status=${status}).`);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true,
      });

      if (result.canceled || result.cancelled) {
        if (Platform.OS === 'android') ToastAndroid.show('Camera cancelled — opening Files picker as fallback', ToastAndroid.SHORT);
        else Alert.alert('Cancelled', 'Camera action was cancelled — opening Files picker as fallback');
        try {
          const doc = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
          if (doc.type === 'success') {
            const uri = doc.uri;
            const name = doc.name || (uri && uri.split('/').pop());
            const fileObj = { uri, name };
            if (!files.find(f => f.uri === uri)) setFiles(prev => [...prev, fileObj]);
            return;
          } else {
            return;
          }
        } catch (e) {
          return;
        }
      }

      const asset = result.assets ? result.assets[0] : result;
      const uri = asset.uri;
      const name = asset.fileName || uri.split('/').pop();
      const base64 = asset.base64;

      const fileObj = { uri, name, base64 };
      if (!files.find(f => f.uri === uri)) {
        setFiles(prev => [...prev, fileObj]);
        if (Platform.OS === 'android') ToastAndroid.show(`${name} captured`, ToastAndroid.SHORT);
        else Alert.alert('File selected', name);
      } else {
        if (Platform.OS === 'android') ToastAndroid.show('File already selected', ToastAndroid.SHORT);
        else Alert.alert('Info', 'File already selected');
      }
    } catch (err) {
      Alert.alert('Error', 'Camera failed: ' + (err?.message || err));
    }
  };

  const convertToPDF = (file) => {
    const uriToBase64 = async (uri) => {
      try {
        const data = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        if (data && data.length > 0) return data;
      } catch (e) {}

      try {
        const parts = uri.split('.');
        const ext = parts.length > 1 ? parts.pop() : 'tmp';
        const tmpPath = FileSystem.cacheDirectory + `tmp-${Date.now()}.${ext}`;
        await FileSystem.copyAsync({ from: uri, to: tmpPath });
        const data = await FileSystem.readAsStringAsync(tmpPath, { encoding: FileSystem.EncodingType.Base64 });
        if (data && data.length > 0) return data;
        throw new Error('Fallback read produced empty data');
      } catch (e) {
        throw new Error('Unable to read file data for conversion: ' + (e?.message || e));
      }
    };

    const doConvert = async () => {
      try {
        const name = file.name || 'file';
        const ext = name.split('.').pop()?.toLowerCase() || '';
        const baseName = name.replace(/\.[^/.]+$/, '');

        const saveToDownloads = async (srcPath, filename) => {
          if (Platform.OS === 'android' && Platform.Version < 30) {
            try {
              const perm = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
              if (perm === PermissionsAndroid.RESULTS.GRANTED) {
                const toPath = `/storage/emulated/0/Download/${filename}`;
                await FileSystem.copyAsync({ from: srcPath, to: toPath });
                ToastAndroid.show(`Saved to Downloads: ${toPath}`, ToastAndroid.LONG);
                return true;
              }
            } catch (e) {
              console.log('saveToDownloads: error copying to Downloads', e);
            }
          } else if (Platform.OS === 'android') {
            console.log('Skipping direct copy to Downloads on Android API >= 30; using share/media-library fallback');
          }

          try {
            const Sharing = await import('expo-sharing');
            if (Sharing && Sharing.shareAsync) {
              await Sharing.shareAsync(srcPath);
              return true;
            }
          } catch (e) {
            console.log('Sharing not available');
          }

          try {
            const MediaLibrary = await import('expo-media-library');
            if (MediaLibrary && MediaLibrary.createAssetAsync) {
              try {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status === 'granted') {
                  const asset = await MediaLibrary.createAssetAsync(srcPath);
                  ToastAndroid.show?.(`Saved to library: ${asset.uri}`) || console.log('Saved to library', asset.uri);
                  return true;
                }
              } catch (e) {
                console.log('media-library: permission/create failed', e);
              }
            }
          } catch (e) {
            console.log('MediaLibrary fallback failed');
          }

          return false;
        };

        if (['jpg', 'jpeg', 'png'].includes(ext)) {
          let base64 = file.base64 || await uriToBase64(file.uri);
          const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
          const html = `<!DOCTYPE html><body style=\"margin:0;padding:0;\"><img src=\"data:${mime};base64,${base64}\" style=\"width:100%;height:auto;\"/></body></html>`;
          const { uri: pdfUri } = await Print.printToFileAsync({ html });
          const dest = FileSystem.documentDirectory + `${baseName}.pdf`;
          await FileSystem.moveAsync({ from: pdfUri, to: dest });

          const saved = await saveToDownloads(dest, `${baseName}.pdf`);
          if (saved) {
            if (Platform.OS !== 'android') Alert.alert('Converted', `${file.name} converted to PDF and available to share/save.`);
          } else {
            Alert.alert('Converted', `${file.name} converted to PDF at ${dest}`);
          }
        } else if (ext === 'pdf') {
          const dest = FileSystem.documentDirectory + `${baseName}.pdf`;
          await FileSystem.copyAsync({ from: file.uri, to: dest });
          Alert.alert('Saved', `${file.name} saved to ${dest}`);
        } else if (ext === 'mp4') {
          try {
            const VideoThumbnails = await import('expo-video-thumbnails');
            const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(file.uri, { time: 1000 });
            const base64 = await uriToBase64(thumbUri);
            const mime = 'image/jpeg';
            const html = `<!DOCTYPE html><body style=\"margin:0;padding:0;\"><img src=\"data:${mime};base64,${base64}\" style=\"width:100%;height:auto;\"/></body></html>`;
            const { uri: pdfUri } = await Print.printToFileAsync({ html });
            const dest = FileSystem.documentDirectory + `${baseName}.pdf`;
            await FileSystem.moveAsync({ from: pdfUri, to: dest });

            const savedVideoPdf = await saveToDownloads(dest, `${baseName}.pdf`);
            if (savedVideoPdf) {
              if (Platform.OS !== 'android') Alert.alert('Converted', `${file.name} converted to PDF and available to share/save.`);
            } else {
              Alert.alert('Converted', `${file.name} converted to PDF at ${dest}`);
            }
          } catch (e) {
            Alert.alert('Conversion error', 'Video -> thumbnail conversion failed: ' + (e?.message || e));
          }
        } else if (['doc', 'docx'].includes(ext)) {
          try {
            const formData = new FormData();
            formData.append('file', {
              uri: file.uri,
              name: file.name,
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });

            const response = await fetch(`${BACKEND_URL}/convert`, {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (!response.ok) {
              throw new Error('Conversion failed');
            }

            const blob = await response.blob();
            const pdfUri = FileSystem.documentDirectory + `${baseName}.pdf`;
            const reader = new FileReader();
            reader.onload = async () => {
              const base64 = reader.result.split(',')[1];
              await FileSystem.writeAsStringAsync(pdfUri, base64, { encoding: FileSystem.EncodingType.Base64 });

              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(pdfUri);
              } else {
                Alert.alert('Converted', `PDF saved to ${pdfUri}`);
              }
            };
            reader.readAsDataURL(blob);

            Alert.alert('Converted', `${file.name} converted to PDF successfully.`);
          } catch (err) {
            Alert.alert('Conversion error', 'Failed to convert Word file: ' + (err?.message || err));
          }
        }

        setFiles((prev) => prev.filter((f) => f.uri !== file.uri));
      } catch (err) {
        Alert.alert('Conversion error', err?.message || String(err));
      }
    };

    doConvert();
  };

  const confirmDelete = (file) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete ${file.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => setFiles(prev => prev.filter(f => f.uri !== file.uri)) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="description" size={36} color="#4CAF50" />
        <Text style={styles.title}>Word to PDF Converter</Text>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={pickWordFiles}>
        <MaterialIcons name="file-upload" size={24} color="white" />
        <Text style={styles.uploadText}>Select Word Files</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.uploadButton, styles.galleryButton]} onPress={pickFromGallery}>
        <MaterialIcons name="photo-library" size={24} color="white" />
        <Text style={styles.uploadText}>Select From Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.uploadButton, styles.cameraButton]} onPress={pickFromCamera}>
        <MaterialIcons name="photo-camera" size={24} color="white" />
        <Text style={styles.uploadText}>Take Photo</Text>
      </TouchableOpacity>

      {files.length === 0 && <Text style={styles.noFiles}>No files selected yet</Text>}

      <FlatList
        data={files}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <View style={styles.fileContainer}>
            <MaterialIcons name="insert-drive-file" size={28} color="#2196F3" />
            <Text style={styles.fileName}>{item.name}</Text>

            <TouchableOpacity onPress={() => convertToPDF(item)} style={styles.convertButton}>
              <MaterialIcons name="picture-as-pdf" size={24} color="white" />
              <Text style={styles.convertText}>Convert</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.deleteButton}>
              <MaterialIcons name="delete" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
              padding: 20,
              paddingTop: 40,
              backgroundColor: '#F5F5F5' 
             },
  header: { flexDirection: 'row',
           alignItems: 'center',
           marginBottom: 20 
          },
  title: { fontSize: 22, 
          fontWeight: 'bold', 
          marginLeft: 10, 
          color: '#333'
         },
  uploadButton: { flexDirection: 'row',
                 alignItems: 'center', 
                 backgroundColor: '#4CAF50',
                 padding: 12, borderRadius: 8, 
                 justifyContent: 'center', 
                 marginBottom: 15 
                },
  uploadText: { color: 'white', 
               fontWeight: 'bold', 
               marginLeft: 8, 
               fontSize: 16 
              },
  noFiles: { textAlign: 'center',
            marginTop: 30,
            color: '#888', 
            fontStyle: 'italic'
           },
  fileContainer: { flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  padding: 10,
                  marginVertical: 6, 
                  borderRadius: 8, 
                  elevation: 1 
                 },
  fileName: { flex: 1, 
             marginLeft: 10, 
             fontSize: 16, 
             color: '#444'
            },
  convertButton: { flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: '#E91E63', 
                  padding: 8, borderRadius: 6,
                  marginRight: 10 
                 },
  convertText: { color: 'white',
                marginLeft: 6, 
                fontWeight: '600'
               },
  deleteButton: { backgroundColor: '#F44336', 
                 padding: 8, 
                 borderRadius: 6 
                },
  galleryButton: { backgroundColor: '#1976D2' 
                 },
  cameraButton: { backgroundColor: '#009688' 
                }
});
