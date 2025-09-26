import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [pickedFiles, setPickedFiles] = useState([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        multiple: true,
      });

      if (!result.canceled) {
        const newFiles = result.assets.map(asset => ({
          ...asset,
          id: asset.name + Math.random(), 
        }));
        setPickedFiles(prevFiles => [...prevFiles, ...newFiles]);
        console.log("Selected Files:", newFiles);
      } else {
        console.log("User cancelled file picking");
      }
    } catch (err) {
      console.error("Error picking document: ", err);
    }
  };

  const renderFileItem = ({ item }) => (
    <View style={styles.fileItem}>
      <MaterialCommunityIcons name="file-word-outline" size={24} color="#007bff" />
      <Text style={styles.fileName}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="file-word-box" size={40} color="#007bff" />
        <Text style={styles.title}>Word to PDF Converter</Text>
      </View>
      
      <View style={styles.mainContent}>
        <Text style={styles.subtitle}>
          Convert your .doc and .docx files to PDF with a single click.
        </Text>
        
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <MaterialCommunityIcons name="plus-circle" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload Word Document</Text>
        </TouchableOpacity>

        {pickedFiles.length > 0 && (
          <View style={styles.fileListContainer}>
            <Text style={styles.fileListHeader}>Selected Files:</Text>
            <FlatList
              data={pickedFiles}
              renderItem={renderFileItem}
              keyExtractor={item => item.id}
              style={styles.fileList}
            />
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your files are auto-deleted after conversion for privacy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 50,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  mainContent: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  fileListContainer: {
    marginTop: 30,
    width: '100%',
    flex: 1,
  },
  fileListHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  fileList: {
    width: '100%',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fileName: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
});