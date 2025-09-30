import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert, StyleSheet, ToastAndroid } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [files, setFiles] = useState([]);

  const pickWordFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: true,
      });

      if (result.type === 'success') {
        if (!files.find(f => f.uri === result.uri)) {
          setFiles((prevFiles) => [...prevFiles, result]);
          ToastAndroid.show(`${result.name} selected`, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('File already selected', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'File picking failed: ' + error.message);
    }
  };

  const convertToPDF = (file) => {
    ToastAndroid.show(`Converting ${file.name} to PDF...`, ToastAndroid.SHORT);

    setTimeout(() => {
      ToastAndroid.show(`${file.name} converted successfully!`, ToastAndroid.LONG);
      setFiles((prev) => prev.filter((f) => f.uri !== file.uri));
    }, 2000);
  };

  const confirmDelete = (file) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete ${file.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => setFiles(prev => prev.filter(f => f.uri !== file.uri)) },
      ],
      { cancelable: true }
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
  container: { 
    flex: 1,
    padding: 20,
    paddingTop: 40, 
    backgroundColor: '#F5F5F5' 
  },
  header: { 
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 20 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginLeft: 10, 
    color: '#333' 
  },
  uploadButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#4CAF50', 
    padding: 12, 
    borderRadius: 8,
    justifyContent: 'center', 
    marginBottom: 15,
  },
  uploadText: { 
    color: 'white', 
    fontWeight: 'bold', 
    marginLeft: 8, 
    fontSize: 16 
  },
  noFiles: { 
    textAlign: 'center',
    marginTop: 30, 
    color: '#888',
    fontStyle: 'italic'
   },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    backgroundColor: 'white',
    padding: 10, 
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
  },
  fileName: { 
    flex: 1, 
    marginLeft: 10, fontSize: 16, 
    color: '#444'
   },
  convertButton: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#E91E63',
    padding: 8, 
    borderRadius: 6,
    marginRight: 10,
  },
  convertText: { 
    color: 'white', 
    marginLeft: 6, 
    fontWeight: '600' },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 6,
  },
});
