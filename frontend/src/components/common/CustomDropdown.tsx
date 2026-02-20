import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import colors from 'constants/colors';

interface DropdownOption {
  label: string;
  value: string;
}
interface CustomDropdownProps {
  label: string;
  value: string;
  options: readonly { label: string; value: string }[];
  onSelect: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  options,
  onSelect,
  error,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={[styles.dropdownButton, error && styles.dropdownError]}
      >
        <Text style={value ? styles.selectedText : styles.placeholderText}>
          {selectedOption?.label || 'Sélectionner'}
        </Text>
        <View style={styles.chevron} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  style={[
                    styles.optionItem,
                    item.value === value && styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && <View style={styles.checkmark} />}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    fontWeight: 'bold',
    color: colors.neutral.gray800,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  required: {
    color: colors.status.error,
    fontWeight: 'bold',
  },
  dropdownButton: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownError: {
    borderColor: colors.status.error,
    backgroundColor: colors.status.errorLight,
  },
  selectedText: {
    fontSize: 14,
    color: colors.neutral.gray900,
    fontWeight: '600',
  },
  placeholderText: {
    fontSize: 14,
    color: colors.neutral.gray400,
    fontWeight: '500',
  },
  chevron: {
    width: 7,
    height: 7,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.neutral.gray600,
    transform: [{ rotate: '45deg' }, { translateY: -2 }],
  },
  errorText: {
    fontSize: 11,
    color: colors.status.error,
    marginTop: 6,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 15, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    width: '88%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.beige,
    backgroundColor: colors.neutral.offWhite,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.neutral.gray900,
    letterSpacing: 0.3,
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.beige,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    backgroundColor: colors.neutral.offWhite,
  },
  optionText: {
    fontSize: 14,
    color: colors.neutral.gray700,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: colors.atb.burgundy,
    fontWeight: '700',
  },
  checkmark: {
    width: 12,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.atb.burgundy,
    transform: [{ rotate: '-45deg' }],
  },
  closeButton: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.neutral.offWhite,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.neutral.gray700,
  },
});

export default CustomDropdown;
