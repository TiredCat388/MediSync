import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export default function AppText(props: TextProps) {
  const { style, ...rest } = props;
  const flatStyle = StyleSheet.flatten(style) || {};
  const isBold = flatStyle.fontWeight === 'bold' || flatStyle.fontWeight === '700';

  const { fontWeight, ...styleWithoutFontWeight } = flatStyle;

  return (
    <Text
      {...rest}
      style={[
        { fontFamily: isBold ? 'AGBold' : 'AnekGujarati', color: '#000000' },
        styleWithoutFontWeight,
      ]}
    />
  );
}
