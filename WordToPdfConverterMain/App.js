import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";

export default function App() {
  const [fileName, setFileName] = useState("");

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/msword", 
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
        ],
      });

      if (result.type === "success") {
        setFileName(result.name);
      } else {
        console.log("User cancelled");
      }
    } catch (err) {
      console.error("Error picking file:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Word to PDF Converter</Text>

      <TouchableOpacity style={styles.button} onPress={pickFile}>
        <Text style={styles.buttonText}>Select Word File</Text>
      </TouchableOpacity>

      {fileName ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Selected File:</Text>
          <Text style={styles.resultName}>{fileName}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultBox: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
    color: "#000",
  },
});