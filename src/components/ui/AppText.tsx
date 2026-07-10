import { PropsWithChildren } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';

import { useTheme } from '@/theme/useTheme';

export type TextVariant =
  | 'display'
  | 'headline'
  | 'title'
  | 'body'
  | 'bodySmall'
  | 'label'
  | 'caption';

interface AppTextProps extends PropsWithChildren, TextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
  style?: StyleProp<TextStyle>;
}

const variantStyles: Record<TextVariant, TextStyle> = {
  display: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
  },

  headline: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },

  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },

  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },

  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },

  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
};

export function AppText({
  children,
  variant = 'body',
  color,
  align = 'left',
  weight,
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();

  return (
    <Text
      {...rest}
      style={[
        styles.base,
        variantStyles[variant],
        {
          color: color ?? colors.text,
          textAlign: align,
          fontWeight: weight ?? variantStyles[variant].fontWeight,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
