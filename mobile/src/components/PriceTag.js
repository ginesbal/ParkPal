import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TOKENS, PALETTE } from '../constants/theme';

export default function PriceTag({ price, small = false }) {
  const isFree = typeof price === 'string' && price.toLowerCase().includes('free');
  return (
    <View style={[
      styles.tag, 
      small && styles.tagSmall,
      { backgroundColor: isFree ? PALETTE.straw.DEFAULT : TOKENS.primary }
    ]}>
      <Text style={[styles.text, small && styles.textSmall]}>
        {isFree ? 'FREE' : price}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  textSmall: {
    fontSize: 10,
  },
});