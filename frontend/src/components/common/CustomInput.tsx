import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import colors from 'constants/colors';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  required,
  value,
  onChangeText,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral.gray400}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={colors.atb.primary}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.gray800,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  required: {
    color: colors.status.error,
    fontWeight: '700',
  },
  inputWrapper: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
  },
  inputFocused: {
    borderColor: colors.atb.burgundy,
    borderWidth: 2,
    backgroundColor: colors.neutral.white,
  },
  inputError: {
    borderColor: colors.status.error,
    backgroundColor: colors.status.errorLight,
  },
  input: {
    fontSize: 14,
    color: colors.neutral.gray900,
    fontWeight: '600',
    padding: 0,
  },
  errorText: {
    fontSize: 11,
    color: colors.status.error,
    marginTop: 6,
    fontWeight: '600',
  },
});

export default CustomInput;
