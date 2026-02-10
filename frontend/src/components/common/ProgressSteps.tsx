import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Step {
  id: number;
  title: string;
  icon: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => {
  return (
    <View className="bg-white border-b border-gray-200 px-2 py-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <View key={step.id} className="flex-row items-center">
              {/* Step Circle */}
              <View className="items-center">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500'
                      : isActive
                      ? 'bg-red-600'
                      : 'bg-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={24} color="#ffffff" />
                  ) : (
                    <Ionicons
                      name={step.icon as any}
                      size={22}
                      color={isActive ? '#ffffff' : '#9CA3AF'}
                    />
                  )}
                </View>
                <Text
                  className={`text-xs mt-2 text-center w-20 ${
                    isActive
                      ? 'text-red-600 font-bold'
                      : isCompleted
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </Text>
              </View>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <View
                  className={`h-0.5 w-8 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ProgressSteps;