import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Dimensions, 
  Animated,
  Platform
} from 'react-native';
import colors from 'constants/colors';

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChangeOtp?: (otp: string) => void;
}

const { width } = Dimensions.get('window');

const OtpInput: React.FC<OtpInputProps> = ({ 
  length = 6, 
  onComplete,
  onChangeOtp 
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const focusAnimations = useRef<Animated.Value[]>(
    Array(length).fill(0).map(() => new Animated.Value(0))
  ).current;

  const handleFocus = (index: number) => {
    setActiveIndex(index);
    Animated.spring(focusAnimations[index], {
      toValue: 1,
      tension: 150,
      friction: 12,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = (index: number) => {
    setActiveIndex(-1);
    Animated.spring(focusAnimations[index], {
      toValue: 0,
      tension: 150,
      friction: 12,
      useNativeDriver: true,
    }).start();
  };

  const handleChange = (text: string, index: number) => {
    // Ne permettre que les chiffres
    const numericText = text.replace(/[^0-9]/g, '');
    
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onChangeOtp?.(otpString);

    if (numericText && index < length - 1) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 50);
    }

    if (otpString.length === length && !otpString.includes('')) {
      onComplete?.(otpString);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 50);
    }
  };

  const isSmallDevice = width < 375;
  const inputSize = isSmallDevice ? 44 : 50;
  const inputSpacing = isSmallDevice ? 8 : 10;

  return (
    <View style={[styles.container, { gap: inputSpacing }]}>
      {Array(length).fill(0).map((_, index) => {
        const isFocused = activeIndex === index;
        const hasValue = otp[index] !== '';
        
        return (
          <View key={index} style={styles.inputContainer}>
            <Animated.View
              style={[
                styles.inputWrapper,
                {
                  width: inputSize,
                  height: inputSize,
                  transform: [
                    {
                      scale: focusAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.05]
                      })
                    }
                  ]
                },
                hasValue && styles.filledWrapper,
                isFocused && styles.focusedWrapper
              ]}
            >
              <Animated.View
                style={[
                  styles.highlightBorder,
                  {
                    opacity: focusAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1]
                    })
                  }
                ]}
              />
              
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.input,
                  {
                    width: inputSize,
                    height: inputSize,
                    fontSize: isSmallDevice ? 22 : 24,
                  },
                  hasValue && styles.inputFilled,
                  isFocused && styles.inputFocused
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={otp[index]}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleFocus(index)}
                onBlur={() => handleBlur(index)}
                selectTextOnFocus
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                cursorColor={colors.atb.red}
              />
              
              {!hasValue && !isFocused && (
                <View style={styles.placeholderDot} />
              )}
              
              {hasValue && (
                <Animated.View
                  style={[
                    styles.valueIndicator,
                    {
                      opacity: focusAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1]
                      })
                    }
                  ]}
                />
              )}
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
  },
  inputWrapper: {
    borderRadius: 12,
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray400,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.neutral.gray400,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  focusedWrapper: {
    borderColor: colors.atb.red,
    ...Platform.select({
      ios: {
        shadowColor: colors.atb.red,
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filledWrapper: {
    borderColor: colors.atb.red,
    backgroundColor: colors.neutral.white,
  },
  highlightBorder: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 2,
    borderColor: colors.atb.red,
    borderRadius: 12,
  },
  input: {
    textAlign: 'center',
    fontWeight: '500',
    color: colors.neutral.gray900,
    backgroundColor: 'transparent',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  inputFilled: {
    fontWeight: '600',
    color: colors.neutral.gray900,
  },
  inputFocused: {
    fontWeight: '600',
  },
  placeholderDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral.gray400,
    opacity: 0.6,
    top: '50%',
    left: '50%',
    marginLeft: -2,
    marginTop: -2,
  },
  valueIndicator: {
    position: 'absolute',
    bottom: 4,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: colors.atb.red,
    borderRadius: 1,
    opacity: 0.8,
  },
});

export default OtpInput;