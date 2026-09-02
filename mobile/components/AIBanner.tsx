import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AIBannerProps {
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  caveatText: string;
  isFallback: boolean;
  onPress?: () => void;
}

export const AIBanner: React.FC<AIBannerProps> = ({ confidenceLevel, caveatText, onPress }) => {
  const isHighMatch = confidenceLevel === 'HIGH';
  const isModerateMatch = confidenceLevel === 'MEDIUM';
  const scoreColor = isHighMatch ? '#00A66C' : isModerateMatch ? '#EAA100' : '#E7396A';

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9} 
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>✨ AI Fit & Decision Assistant</Text>
      </View>

      <View style={styles.contentRow}>
        <View style={[styles.badge, { backgroundColor: scoreColor }]}>
          <Text style={styles.badgeText}>
            FIT CONFIDENCE: {confidenceLevel}
          </Text>
        </View>
        <Text style={styles.consensusText} numberOfLines={2}>
          {caveatText}
        </Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Tap for Evidence & Insights &gt;</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4fbf9',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2f4ef',
  },
  headerRow: {
    marginBottom: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: '#03a685',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentRow: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 10,
  },
  consensusText: {
    fontSize: 11,
    color: '#3e4152',
    fontStyle: 'italic',
    lineHeight: 14,
  },
  footerRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2f4ef',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 10,
    color: '#03a685',
    fontWeight: '600',
  },
});
