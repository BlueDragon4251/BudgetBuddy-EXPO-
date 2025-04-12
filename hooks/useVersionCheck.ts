import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { VersionInfo } from '@/types/budget';
import { Platform, Linking } from 'react-native';

export function useVersionCheck() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkVersion();
  }, []);

  const checkVersion = async () => {
    if (Platform.OS === 'web') {
      setIsChecking(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${process.env.EXPO_PUBLIC_GITHUB_REPO}/contents/latest-budgetbuddy.json`,
        {
          headers: {
            Authorization: `token ${process.env.EXPO_PUBLIC_GITHUB_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch version info');
      }

      const data = await response.json();
      const content = JSON.parse(
        Buffer.from(data.content, 'base64').toString('utf-8')
      );

      setVersionInfo(content);
    } catch (err) {
      setError('Failed to check for updates');
      console.error('Version check error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUpdate = async () => {
    if (versionInfo?.downloadUrl) {
      await Linking.openURL(versionInfo.downloadUrl);
    }
  };

  return {
    versionInfo,
    isChecking,
    error,
    handleUpdate,
    currentVersion: Constants.expoConfig?.version || '1.0.0',
  };
}