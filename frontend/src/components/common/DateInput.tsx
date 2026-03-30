
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from 'constants/colors';

interface DateInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = 'JJ/MM/AAAA',
  error,
  required,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
    
    return formatted;
  };

  const handleChangeText = (text: string) => {
    const formatted = formatDate(text);
    onChangeText(formatted);
  };

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
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="number-pad"
          maxLength={10}
          selectionColor={colors.atb.primary}
        />
        <View style={styles.calendarIcon} />
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    fontSize: 14,
    color: colors.neutral.gray900,
    fontWeight: '600',
    padding: 0,
  },
  calendarIcon: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray500,
    borderRadius: 3,
    marginLeft: 10,
  },
  errorText: {
    fontSize: 11,
    color: colors.status.error,
    marginTop: 6,
    fontWeight: '600',
  },
});

export default DateInput;
