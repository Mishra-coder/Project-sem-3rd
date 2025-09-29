// App.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList,
  ActivityIndicator,
  Alert, // Naya import: Alert for download success
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [pickedFiles, setPickedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickDocument = async () => {
    if (isProcessing) return;
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
          isConverted: false,
          progress: 0,
        }));
        setPickedFiles(prevFiles => [...prevFiles, ...newFiles]);
      }
    } catch (err) {
      console.error("Error picking document: ", err);
    }
  };

  const convertFiles = () => {
    if (pickedFiles.length === 0 || isProcessing) return;

    setIsProcessing(true);
    let convertedCount = 0;

    pickedFiles.forEach((file) => {
      // Skip already converted files
      if (file.isConverted) {
          convertedCount++;
          if (convertedCount === pickedFiles.length) setIsProcessing(false);
          return;
      }
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20; 
        
        setPickedFiles(prevFiles => prevFiles.map(f => 
          f.id === file.id ? { ...f, progress: Math.min(progress, 100) } : f
        ));

        if (progress >= 100) {
          clearInterval(interval);
          convertedCount++;

          setPickedFiles(prevFiles => prevFiles.map(f => 
            f.id === file.id ? { ...f, isConverted: true } : f
          ));

          if (convertedCount === pickedFiles.length) {
            setIsProcessing(false);
          }
        }
      }, 300);
    });
  };

  // Naya Function: Download Alert
  const handleDownload = (fileName) => {
      Alert.alert(
          "Download Successful",
          `${fileName.replace('.docx', '.pdf').replace('.doc', '.pdf')} is ready to download. (Simulation)`
      );
  };

  const ProgressBar = ({ progress, isConverted }) => {
    const width = `${progress}%`;
    const color = isConverted ? '#28a745' : '#ffc107';
    
    if (progress === 0 && !isConverted) return null;

    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width, backgroundColor: color }]} />
      </View>
    );
  };

  const renderFileItem = ({ item }) => (
    <View style={styles.fileItem}>
      {/* Icon: PDF (Red) if converted, Word (Blue) otherwise */}
      <MaterialCommunityIcons 
        name={item.isConverted ? "file-pdf-box" : "file-word-outline"} 
        size={26} 
        color={item.isConverted ? "#dc3545" : "#007bff"}
      />
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <ProgressBar progress={item.progress} isConverted={item.isConverted} />
      </View>
      
      {/* Download Button */}
      {item.isConverted ? (
        <TouchableOpacity onPress={() => handleDownload(item.name)}>
          <MaterialCommunityIcons name="download-circle" size={30} color="#28a745" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      ) : (
        // Loader while processing
        item.progress > 0 && item.progress < 100 && (
          <ActivityIndicator color="#007bff" style={{ marginLeft: 10 }} />
        )
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="file-word-box" size={40} color="#dc3545" />
        <Text style={styles.title}>Word to PDF Converter</Text>
      </View>
      
      <View style={styles.mainContent}>
        <Text style={styles.subtitle}>
          Select your documents, convert instantly, and download your PDFs securely.
        </Text>
        
        {/* Upload Button */}
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={pickDocument}
          disabled={isProcessing}
        >
          <MaterialCommunityIcons name="plus-circle" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload Word Document(s)</Text>
        </TouchableOpacity>

        {/* Conversion Button */}
        {pickedFiles.length > 0 && (
          <TouchableOpacity 
            style={[styles.convertButton, (isProcessing || pickedFiles.every(f => f.isConverted)) && styles.convertButtonDisabled]} 
            onPress={convertFiles}
            disabled={isProcessing || pickedFiles.every(f => f.isConverted)}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
            ) : (
              <MaterialCommunityIcons name="file-chart-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
            )}
            <Text style={styles.convertButtonText}>
              {isProcessing ? 'Converting...' : (pickedFiles.every(f => f.isConverted) ? 'All Converted' : 'Start Conversion')}
            </Text>
          </TouchableOpacity>
        )}

        {/* File List */}
        {pickedFiles.length > 0 && (
          <View style={styles.fileListContainer}>
            <Text style={styles.fileListHeader}>Selected Files ({pickedFiles.filter(f => !f.isConverted).length} pending):</Text>
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
          Your privacy is our priority. Files are not stored on our server.
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
    marginBottom: 30,
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '100%',
    maxWidth: 300, 
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
  },
  convertButton: {
    flexDirection: 'row',
    backgroundColor: '#dc3545', // Red for Conversion (PDF)
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 15,
    width: '100%',
    maxWidth: 300, 
  },
  convertButtonDisabled: {
    backgroundColor: '#6c757d', // Grey when disabled
    opacity: 0.8,
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
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
    marginTop: 25,
    width: '100%',
    flex: 1,
  },
  fileListHeader: {
    fontSize: 15,
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
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  fileName: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 5,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});