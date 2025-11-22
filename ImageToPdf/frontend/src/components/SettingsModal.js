import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const SettingsModal = ({ visible, onClose, settings, onUpdateSettings }) => {
    const Option = ({ label, value, selected, onSelect }) => (
        <TouchableOpacity
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onSelect(value)}
        >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
            {selected && <MaterialIcons name="check" size={20} color="#4CAF50" />}
        </TouchableOpacity>
    );

    const Section = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.optionsContainer}>
                {children}
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>PDF Settings</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        <Section title="Page Size">
                            <Option
                                label="A4"
                                value="A4"
                                selected={settings.pageSize === 'A4'}
                                onSelect={(v) => onUpdateSettings({ ...settings, pageSize: v })}
                            />
                            <Option
                                label="Letter"
                                value="Letter"
                                selected={settings.pageSize === 'Letter'}
                                onSelect={(v) => onUpdateSettings({ ...settings, pageSize: v })}
                            />
                            <Option
                                label="Fit to Image"
                                value="Fit"
                                selected={settings.pageSize === 'Fit'}
                                onSelect={(v) => onUpdateSettings({ ...settings, pageSize: v })}
                            />
                        </Section>

                        <Section title="Orientation">
                            <Option
                                label="Portrait"
                                value="Portrait"
                                selected={settings.orientation === 'Portrait'}
                                onSelect={(v) => onUpdateSettings({ ...settings, orientation: v })}
                            />
                            <Option
                                label="Landscape"
                                value="Landscape"
                                selected={settings.orientation === 'Landscape'}
                                onSelect={(v) => onUpdateSettings({ ...settings, orientation: v })}
                            />
                        </Section>

                        <Section title="Margins">
                            <Option
                                label="None"
                                value="None"
                                selected={settings.margins === 'None'}
                                onSelect={(v) => onUpdateSettings({ ...settings, margins: v })}
                            />
                            <Option
                                label="Small"
                                value="Small"
                                selected={settings.margins === 'Small'}
                                onSelect={(v) => onUpdateSettings({ ...settings, margins: v })}
                            />
                            <Option
                                label="Normal"
                                value="Normal"
                                selected={settings.margins === 'Normal'}
                                onSelect={(v) => onUpdateSettings({ ...settings, margins: v })}
                            />
                        </Section>
                    </ScrollView>

                    <TouchableOpacity style={styles.saveButton} onPress={onClose}>
                        <Text style={styles.saveButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '70%',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
    },
    optionsContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        overflow: 'hidden',
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    optionSelected: {
        backgroundColor: '#E8F5E9',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    optionTextSelected: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
