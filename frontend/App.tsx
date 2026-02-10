
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EligibilityConditionsScreen from './src/screens/EligibilityConditionsScreen';
import OnboardingPersonalDataScreen from './src/screens/OnboardingPersonalDataScreen';
import { RootStackParamList } from './src/types/navigation';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import HomeScreen from '@/screens/HomeScreen';
import 'react-native-gesture-handler';
import FATCAScreen from '@/screens/FATCAScreen';
import DocumentJustificatifScreen from '@/screens/DocumentsJustificatifScreen';
import OnboardingHomeScreen from '@/screens/OnboardingHomeScreen';
import PersonaldataformScreen from '@/screens/Personaldataform';
import DigigoScreen from '@/screens/DigigoScreen';
import ResumeRequestScreen from '@/screens/ResumeRequestScreen';
import IdentityVerificationScreen from '@/screens/IdentityVerificationScreen';
import ResumeWithReferenceScreen from '@/screens/ResumeWithReferenceScreen';
import ForgetPasswordScreen from '@/screens/ForgotPasswordScreen';
import NewPasswordScreen from '@/screens/NewPasswordScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OnboardingHome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="EligibilityConditions" 
          component={EligibilityConditionsScreen}
        />
        <Stack.Screen 
          name="OnboardingPersonalData" 
          component={OnboardingPersonalDataScreen}
        />
        <Stack.Screen 
          name="OtpVerification" 
          component={OtpVerificationScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
        name="FATCA"
        component={FATCAScreen}
      />
       <Stack.Screen
        name="DocumentsJustificatif"
        component={DocumentJustificatifScreen}
      />

      <Stack.Screen
        name="OnboardingHome"
        component={OnboardingHomeScreen}
      />
      <Stack.Screen
        name="Personaldataform"
        component={PersonaldataformScreen}
      />
      <Stack.Screen
        name="DigigoScreen"
        component={DigigoScreen}
      />
      <Stack.Screen
        name="ResumeRequest"
        component={ResumeRequestScreen}
      />
      <Stack.Screen
        name="IdentityVerification"
        component={IdentityVerificationScreen}
      />
      <Stack.Screen
        name="ResumewithReference"
        component={ResumeWithReferenceScreen}
      /> 
       <Stack.Screen
        name="ForgetPassword"
        component={ForgetPasswordScreen}
      /> 
      <Stack.Screen
        name="NewPassword"
        component={NewPasswordScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}