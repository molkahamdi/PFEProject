import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from 'constants/colors';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={index}>
              <View style={styles.stepWrapper}>
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCompleted,
                    isActive && styles.stepActive,
                  ]}
                >
                  {isCompleted ? (
                    <View style={styles.checkmark} />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        isActive && styles.stepNumberActive,
                      ]}
                    >
                      {stepNumber}
                    </Text>
                  )}
                </View>
              </View>

              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    stepNumber < currentStep && styles.connectorCompleted,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      <View style={styles.labelsRow}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <View key={index} style={styles.labelWrapper}>
              <Text
                style={[
                  styles.labelText,
                  isActive && styles.labelActive,
                  isCompleted && styles.labelCompleted,
                ]}
                numberOfLines={2}
              >
                {step}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCompleted: {
    backgroundColor: colors.neutral.gray700,
    borderColor: colors.neutral.gray700,
  },
  stepActive: {
    backgroundColor: colors.atb.burgundy,
    borderColor: colors.atb.burgundy,
    borderWidth: 2,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral.gray400,
  },
  stepNumberActive: {
    color: colors.neutral.white,
    fontSize: 13,
    fontWeight: '800',
  },
  checkmark: {
    width: 12,
    height: 7,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.neutral.white,
    transform: [{ rotate: '-45deg' }, { translateY: -1.5 }],
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.neutral.gray300,
    marginHorizontal: 4,
  },
  connectorCompleted: {
    backgroundColor: colors.neutral.gray700,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  labelText: {
    fontSize: 9,
    textAlign: 'center',
    color: colors.neutral.gray500,
    fontWeight: '600',
    lineHeight: 12,
  },
  labelActive: {
    color: colors.atb.burgundy,
    fontWeight: '800',
  },
  labelCompleted: {
    color: colors.neutral.gray700,
    fontWeight: '700',
  },
});

export default StepIndicator;
