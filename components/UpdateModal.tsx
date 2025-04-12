import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VersionInfo } from '@/types/budget';
import { useColorScheme } from 'react-native';

interface UpdateModalProps {
  versionInfo: VersionInfo;
  currentVersion: string;
  onUpdate: () => void;
  onClose: () => void;
}

export function UpdateModal({
  versionInfo,
  currentVersion,
  onUpdate,
  onClose,
}: UpdateModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
          ]}>
          <Text
            style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
            Neue Version verfügbar
          </Text>
          <Text
            style={[
              styles.versionText,
              { color: isDark ? '#888888' : '#666666' },
            ]}>
            Aktuelle Version: {currentVersion}
          </Text>
          <Text
            style={[
              styles.versionText,
              { color: isDark ? '#888888' : '#666666' },
            ]}>
            Neue Version: {versionInfo.latestVersion}
          </Text>

          <Text
            style={[
              styles.message,
              { color: isDark ? '#ffffff' : '#000000' },
            ]}>
            {versionInfo.message}
          </Text>

          <View style={styles.changelogContainer}>
            <Text
              style={[
                styles.changelogTitle,
                { color: isDark ? '#ffffff' : '#000000' },
              ]}>
              Änderungen:
            </Text>
            {versionInfo.changelog.map((change, index) => (
              <Text
                key={index}
                style={[
                  styles.changelogItem,
                  { color: isDark ? '#888888' : '#666666' },
                ]}>
                • {change}
              </Text>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            {!versionInfo.forceUpdate && (
              <TouchableOpacity
                style={[styles.button, styles.laterButton]}
                onPress={onClose}>
                <Text style={styles.buttonText}>Später</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                styles.updateButton,
                !versionInfo.forceUpdate && { marginLeft: 10 },
              ]}
              onPress={onUpdate}>
              <Text style={styles.buttonText}>Jetzt aktualisieren</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalView: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 10,
  },
  versionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginVertical: 15,
  },
  changelogContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  changelogTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 10,
  },
  changelogItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  laterButton: {
    backgroundColor: '#ff3b30',
  },
  updateButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});