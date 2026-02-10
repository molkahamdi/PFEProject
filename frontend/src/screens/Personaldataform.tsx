import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomDropdown from '../components/common/CustomDropdown';
import DateInput from '../components/common/DateInput';
import colors from 'constants/colors';

type NavigationProp = {
  goBack: () => void;
  navigate: (screen: string) => void;
};

type PersonalDataFormProps = {
  navigation: NavigationProp;
};

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    pays: 'Tunisie',
    gouvernorat: '',
    delegation: '',
    codePostal: '',
    adresse: '',
    adresseSuite: '',
    
    // Profession
    situationProfessionnelle: '',
    profession: '',
    posteActuel: '',
    dateEmbauche: '',
    employeur: '',
    entreprise: '',
    revenuMensuel: '',
    
    // Agence de rattachement
    agenceDattachement: '',
    gouvernoratAgence: '',
    agence: '',
  });

  const [showProfessionalFields, setShowProfessionalFields] = useState(false);
  const [showProfessionField, setShowProfessionField] = useState(true);

  const gouvernorats = [
    { label: 'Tunis', value: 'Tunis' },
    { label: 'Ariana', value: 'Ariana' },
    { label: 'Ben Arous', value: 'Ben Arous' },
    { label: 'Manouba', value: 'Manouba' },
    { label: 'Nabeul', value: 'Nabeul' },
    { label: 'Zaghouan', value: 'Zaghouan' },
    { label: 'Bizerte', value: 'Bizerte' },
    { label: 'Béja', value: 'Béja' },
    { label: 'Jendouba', value: 'Jendouba' },
    { label: 'Kef', value: 'Kef' },
    { label: 'Siliana', value: 'Siliana' },
    { label: 'Kairouan', value: 'Kairouan' },
    { label: 'Kasserine', value: 'Kasserine' },
    { label: 'Sidi Bouzid', value: 'Sidi Bouzid' },
    { label: 'Sousse', value: 'Sousse' },
    { label: 'Monastir', value: 'Monastir' },
    { label: 'Mahdia', value: 'Mahdia' },
    { label: 'Sfax', value: 'Sfax' },
    { label: 'Gafsa', value: 'Gafsa' },
    { label: 'Tozeur', value: 'Tozeur' },
    { label: 'Kebili', value: 'Kebili' },
    { label: 'Gabès', value: 'Gabès' },
    { label: 'Medenine', value: 'Medenine' },
    { label: 'Tataouine', value: 'Tataouine' },
  ];

  const delegations: Record<string, string[]> = {
    'Tunis': ['Carthage', 'La Médina', 'Le Bardo', 'Le Kram', 'La Goulette', 'Sidi Bou Said'],
    'Ariana': ['Ariana Ville', 'Ettadhamen', 'Mnihla', 'Raoued', 'Kalâat el-Andalous', 'Soukra'],
    'Ben Arous': ['Ben Arous', 'El Mourouj', 'Hammam Lif', 'Hammam Chott', 'Mohamedia'],
    'Manouba': ['Manouba', 'Djedeida', 'Douar Hicher', 'Oued Ellil', 'Tebourba'],
    'Nabeul': ['Nabeul', 'Dar Chaabane', 'El Haouaria', 'Grombalia', 'Hammamet', 'Kélibia'],
  };

  const situationsProfessionnelles = [
    { label: 'Etudiant', value: 'Etudiant' },
    { label: 'Femme au foyer', value: 'Femme au foyer' },
    { label: 'Freelance', value: 'Freelance' },
    { label: 'Retraité', value: 'Retraité' },
    { label: 'Salarié du secteur privé', value: 'Salarié du secteur privé' },
    { label: 'Salarié du secteur public', value: 'Salarié du secteur public' },
    { label: 'Sans emploi', value: 'Sans emploi' },
  ];

  const professions = [
    { label: 'Retraité', value: 'Retraité' },
    { label: 'En recherche d\'emploi', value: 'En recherche d\'emploi' },
    { label: 'Développeur', value: 'Développeur' },
    { label: 'Ingénieur', value: 'Ingénieur' },
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Cadre Administratif', value: 'Cadre Administratif' },
    { label: 'Technicien', value: 'Technicien' },
    { label: 'Consultant', value: 'Consultant' },
    { label: 'Designer', value: 'Designer' },
    { label: 'Fonctionnaire', value: 'Fonctionnaire' },
    { label: 'Enseignant', value: 'Enseignant' },
    { label: 'Médecin', value: 'Médecin' },
    { label: 'Avocat', value: 'Avocat' },
    { label: 'Architecte', value: 'Architecte' },
    { label: 'Comptable', value: 'Comptable' },
    { label: 'Infirmier', value: 'Infirmier' },
    { label: 'Pharmacien', value: 'Pharmacien' },
    { label: 'Journaliste', value: 'Journaliste' },
    { label: 'Artisan', value: 'Artisan' },
    { label: 'Agriculteur', value: 'Agriculteur' },
    { label: 'Autre', value: 'Autre' },
  ];

  const codesPostaux = [
    { label: '1000', value: '1000' },
    { label: '1001', value: '1001' },
    { label: '1002', value: '1002' },
    { label: '1003', value: '1003' },
    { label: '1004', value: '1004' },
    { label: '1005', value: '1005' },
    { label: '1006', value: '1006' },
    { label: '1007', value: '1007' },
    { label: '1008', value: '1008' },
    { label: '1009', value: '1009' },
    { label: '2000', value: '2000' },
    { label: '2001', value: '2001' },
    { label: '2002', value: '2002' },
    { label: '2009', value: '2009' },
    { label: '2010', value: '2010' },
    { label: '2011', value: '2011' },
    { label: '2020', value: '2020' },
    { label: '2021', value: '2021' },
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'situationProfessionnelle') {
      setFormData(prev => ({ 
        ...prev, 
        profession: '',
        posteActuel: '',
        dateEmbauche: '',
        employeur: '',
        entreprise: '',
        revenuMensuel: ''
      }));
      
      const situationsSansProfession = ['Etudiant', 'Femme au foyer', 'Sans emploi'];
      const situationsSansEmploi = ['Etudiant', 'Femme au foyer', 'Retraité', 'Sans emploi'];
      
      setShowProfessionField(!situationsSansProfession.includes(value));
      setShowProfessionalFields(!situationsSansEmploi.includes(value));
      
      if (situationsSansProfession.includes(value)) {
        if (value === 'Sans emploi') {
          setFormData(prev => ({ ...prev, profession: "En recherche d'emploi" }));
        } else {
          setFormData(prev => ({ ...prev, profession: value }));
        }
      }
    }
  };

  const handleContinue = () => {
    const requiredFields = ['gouvernorat', 'delegation', 'codePostal', 'adresse', 'situationProfessionnelle'];
    
    if (showProfessionField) {
      requiredFields.push('profession');
    }
    
    if (showProfessionalFields) {
      requiredFields.push('posteActuel', 'dateEmbauche', 'entreprise', 'revenuMensuel');
    }
    
    requiredFields.push('gouvernoratAgence', 'agence');
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }
    
    navigation.navigate('DigigoScreen');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.white} />
      
      {/* Header identique à EligibilityConditionsScreen */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[colors.atb.primary, colors.atb.primaryDark]}
              style={styles.logoGradient}
            >
              <Image
                source={require('../assets/atb.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.bankName}>Arab Tunisian Bank</Text>
            <Text style={styles.bankSubtitle}>البنك العربي التونسي</Text>
          </View>
        </View>
        
        <LinearGradient
          colors={[colors.atb.red, colors.atb.red]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.digipackBadge}
        >
          <Text style={styles.digipackText}>DIGIPACK</Text>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Section Titre améliorée */}
            <View style={styles.titleSection}>
              <View style={styles.titleHeader}>
                <View>
                  <Text style={styles.title}>Données personnelles</Text>
                  <Text style={styles.subtitle}>
                    Complétez vos informations personnelles et choisissez votre agence
                  </Text>
                </View>
              </View>
            </View>

            {/* Section Adresse - style moderne */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionNumberWrapper}>
                  <Text style={styles.sectionNumber}>1</Text>
                </View>
                <View style={styles.sectionTitleWrapper}>
                  <Text style={styles.sectionTitle}>Adresse de résidence</Text>
                  <Text style={styles.sectionDescription}>Votre adresse actuelle en Tunisie</Text>
                </View>
              </View>

              <View style={styles.formGrid}>
                {/* Pays */}
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldHeader}>
                    <Ionicons name="flag-outline" size={14} color={colors.atb.red} />
                    <Text style={styles.fieldLabel}>Pays</Text>
                    <View style={styles.requiredIndicator} />
                  </View>
                  <CustomDropdown
                    label=""
                    value={formData.pays}
                    options={[{ label: 'Tunisie', value: 'Tunisie' }]}
                    onSelect={(value) => updateFormData('pays', value)}
                    required={false}
                  />
                </View>

                {/* Gouvernorat */}
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldHeader}>
                    <Ionicons name="location-outline" size={14} color={colors.atb.red} />
                    <Text style={styles.fieldLabel}>Gouvernorat</Text>
                    <View style={styles.requiredIndicator} />
                  </View>
                  <CustomDropdown
                    label=""
                    value={formData.gouvernorat}
                    options={gouvernorats}
                    onSelect={(value) => updateFormData('gouvernorat', value)}
                    required={false}
                    placeholder="Sélectionner"
                  />
                </View>

                {/* Délégation */}
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldHeader}>
                    <Ionicons name="map-outline" size={14} color={colors.atb.red} />
                    <Text style={styles.fieldLabel}>Délégation</Text>
                    <View style={styles.requiredIndicator} />
                  </View>
                  <CustomDropdown
                    label=""
                    value={formData.delegation}
                    options={(delegations[formData.gouvernorat] || []).map(d => ({ label: d, value: d }))}
                    onSelect={(value) => updateFormData('delegation', value)}
                    required={false}
                    placeholder="Sélectionner"
                  />
                </View>

                {/* Code Postal */}
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldHeader}>
                    <Ionicons name="mail-outline" size={14} color={colors.atb.red} />
                    <Text style={styles.fieldLabel}>Code postal</Text>
                    <View style={styles.requiredIndicator} />
                  </View>
                  <CustomDropdown
                    label=""
                    value={formData.codePostal}
                    options={codesPostaux}
                    onSelect={(value) => updateFormData('codePostal', value)}
                    required={false}
                    placeholder="Sélectionner"
                  />
                </View>

                {/* Adresse complète */}
                <View style={[styles.fieldGroup, styles.fullWidth]}>
                  <View style={styles.fieldHeader}>
                    <Ionicons name="home-outline" size={14} color={colors.atb.red} />
                    <Text style={styles.fieldLabel}>Adresse complète</Text>
                    <View style={styles.requiredIndicator} />
                  </View>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Numéro, rue, appartement..."
                      placeholderTextColor={colors.neutral.gray400}
                      value={formData.adresse}
                      onChangeText={(value) => updateFormData('adresse', value)}
                      selectionColor={colors.atb.red}
                    />
                  </View>
                </View>

                {/* Complément d'adresse */}
                <View style={[styles.fieldGroup, styles.fullWidth]}>
                  <View style={styles.fieldHeader}>
                    <Ionicons name="add-circle-outline" size={14} color={colors.neutral.gray500} />
                    <Text style={[styles.fieldLabel, styles.optionalLabel]}>Complément d'adresse</Text>
                  </View>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Bâtiment, étage, porte..."
                      placeholderTextColor={colors.neutral.gray400}
                      value={formData.adresseSuite}
                      onChangeText={(value) => updateFormData('adresseSuite', value)}
                      selectionColor={colors.atb.red}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Section Profession - style moderne */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionNumberWrapper}>
                  <Text style={styles.sectionNumber}>2</Text>
                </View>
                <View style={styles.sectionTitleWrapper}>
                  <Text style={styles.sectionTitle}>Situation professionnelle</Text>
                  <Text style={styles.sectionDescription}>Informations sur votre activité</Text>
                </View>
              </View>

              <View style={styles.formGrid}>
                {/* Situation Professionnelle */}
                <View style={[styles.fieldGroup, styles.fullWidth]}>
                  <View style={styles.fieldHeader}>
                    <Ionicons name="briefcase-outline" size={14} color={colors.atb.red} />
                    <Text style={styles.fieldLabel}>Situation actuelle</Text>
                    <View style={styles.requiredIndicator} />
                  </View>
                  <CustomDropdown
                    label=""
                    value={formData.situationProfessionnelle}
                    options={situationsProfessionnelles}
                    onSelect={(value) => updateFormData('situationProfessionnelle', value)}
                    required={false}
                    placeholder="Sélectionner votre situation"
                  />
                </View>

                {/* Profession */}
                {showProfessionField && (
                  <View style={[styles.fieldGroup, styles.fullWidth]}>
                    <View style={styles.fieldHeader}>
                      <Ionicons name="school-outline" size={14} color={colors.atb.red} />
                      <Text style={styles.fieldLabel}>Profession</Text>
                      <View style={styles.requiredIndicator} />
                    </View>
                    <CustomDropdown
                      label=""
                      value={formData.profession}
                      options={professions}
                      onSelect={(value) => updateFormData('profession', value)}
                      required={false}
                      placeholder="Sélectionner votre profession"
                    />
                  </View>
                )}

                {/* Champs professionnels détaillés */}
                {showProfessionalFields && (
                  <>
                    <View style={[styles.fieldGroup, styles.fullWidth]}>
                      <View style={styles.fieldHeader}>
                        <Ionicons name="person-outline" size={14} color={colors.atb.red} />
                        <Text style={styles.fieldLabel}>Poste actuel</Text>
                        <View style={styles.requiredIndicator} />
                      </View>
                      <View style={styles.textInputContainer}>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Ex: Développeur Full Stack"
                          placeholderTextColor={colors.neutral.gray400}
                          value={formData.posteActuel}
                          onChangeText={(value) => updateFormData('posteActuel', value)}
                          selectionColor={colors.atb.red}
                        />
                      </View>
                    </View>

                    <View style={styles.fieldGroup}>
                      <View style={styles.fieldHeader}>
                        <Ionicons name="calendar-outline" size={14} color={colors.atb.red} />
                        <Text style={styles.fieldLabel}>Date d'embauche</Text>
                        <View style={styles.requiredIndicator} />
                      </View>
                      <DateInput
                        label=""
                        placeholder="JJ/MM/AAAA"
                        value={formData.dateEmbauche}
                        onChangeText={(text) => updateFormData('dateEmbauche', text)}
                        required={false}
                      />
                    </View>

                    <View style={[styles.fieldGroup, styles.fullWidth]}>
                      <View style={styles.fieldHeader}>
                        <Ionicons name="business-outline" size={14} color={colors.atb.red} />
                        <Text style={styles.fieldLabel}>Entreprise</Text>
                        <View style={styles.requiredIndicator} />
                      </View>
                      <View style={styles.textInputContainer}>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Nom de l'entreprise"
                          placeholderTextColor={colors.neutral.gray400}
                          value={formData.entreprise}
                          onChangeText={(value) => updateFormData('entreprise', value)}
                          selectionColor={colors.atb.red}
                        />
                      </View>
                    </View>

                    <View style={styles.fieldGroup}>
                      <View style={styles.fieldHeader}>
                        <Ionicons name="cash-outline" size={14} color={colors.atb.red} />
                        <Text style={styles.fieldLabel}>Revenu mensuel net</Text>
                        <View style={styles.requiredIndicator} />
                      </View>
                      <View style={styles.currencyInputContainer}>
                        <Text style={styles.currencySymbol}>DT</Text>
                        <TextInput
                          style={styles.currencyInput}
                          placeholder="0,00"
                          placeholderTextColor={colors.neutral.gray400}
                          value={formData.revenuMensuel}
                          onChangeText={(value) => updateFormData('revenuMensuel', value)}
                          keyboardType="numeric"
                          selectionColor={colors.atb.red}
                        />
                      </View>
                    </View>
                  </>
                )}

                {/* Message informatif */}
                {!showProfessionalFields && formData.situationProfessionnelle && (
                  <View style={styles.infoCard}>
                    <Ionicons name="information-circle-outline" size={20} color={colors.atb.red} />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoText}>
                        {formData.situationProfessionnelle === 'Etudiant' 
                          ? "Vous êtes étudiant. Les champs d'emploi ne sont pas requis."
                          : formData.situationProfessionnelle === 'Femme au foyer'
                          ? "Vous êtes femme au foyer. Les champs d'emploi ne sont pas requis."
                          : formData.situationProfessionnelle === 'Retraité'
                          ? "Vous êtes retraité. Les champs d'emploi ne sont pas requis."
                          : "Vous êtes en recherche d'emploi. Les champs d'emploi ne sont pas requis."}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Section Agence - style moderne */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionNumberWrapper}>
                  <Text style={styles.sectionNumber}>3</Text>
                </View>
                <View style={styles.sectionTitleWrapper}>
                  <Text style={styles.sectionTitle}>Agence de rattachement</Text>
                  <Text style={styles.sectionDescription}>Votre agence ATB de référence</Text>
                </View>
              </View>

              <View style={styles.formGrid}>
                {/* Gouvernorat de l'agence */}
                <View style={[styles.fieldGroup, styles.fullWidth]}>
                  <View style={styles.fieldHeader}>
                    <Ionicons name="business-outline" size={14} color={colors.atb.red} />
                    <Text style={styles.fieldLabel}>Gouvernorat de l'agence</Text>
                    <View style={styles.requiredIndicator} />
                  </View>
                  <CustomDropdown
                    label=""
                    value={formData.gouvernoratAgence}
                    options={gouvernorats}
                    onSelect={(value) => updateFormData('gouvernoratAgence', value)}
                    required={false}
                    placeholder="Sélectionner le gouvernorat"
                    
                  />
                </View>

                {/* Agence */}
                <View style={[styles.fieldGroup, styles.fullWidth]}>
                  <View style={styles.fieldHeader}>
                    <Ionicons name="ban-outline" size={14} color={colors.atb.red} />
                    <Text style={styles.fieldLabel}>Agence ATB</Text>
                    <View style={styles.requiredIndicator} />
                  </View>
                  <CustomDropdown
                    label=""
                    value={formData.agence}
                    options={[
                      { label: 'Agence Centrale Tunis', value: 'Agence Centrale Tunis' },
                      { label: 'Agence Lac', value: 'Agence Lac' },
                      { label: 'Agence Lafayette', value: 'Agence Lafayette' },
                      { label: 'Agence Menzah', value: 'Agence Menzah' },
                    ]}
                    onSelect={(value) => updateFormData('agence', value)}
                    required={false}
                    placeholder="Sélectionner votre agence"
                  />
                </View>
              </View>

              {/* Confidentialité */}
              <View style={styles.securityCard}>
                <View style={styles.securityHeader}>
                  <Ionicons name="shield-checkmark" size={18} color={colors.atb.red} />
                  <Text style={styles.securityTitle}>Confidentialité garantie</Text>
                </View>
                <Text style={styles.securityText}>
                  ATB protège vos données personnelles conformément à la réglementation sur la protection des données.
                </Text>
              </View>
            </View>

            {/* Boutons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={18} color={colors.atb.red} />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleContinue}
                style={styles.continueButton}
              >
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueButtonText}>Continuer</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.neutral.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerDivider} />
              <Text style={styles.footerText}>
                © 2026 Arab Tunisian Bank · Tous droits réservés
              </Text>
              <Text style={styles.footerSubtext}>Service client : 71 143 000</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.gray100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.atb.red,
    letterSpacing: 0.3,
  },
  bankSubtitle: {
    fontSize: 11,
    color: colors.neutral.gray500,
    marginTop: 2,
    fontWeight: '500',
  },
  digipackBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digipackText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.neutral.white,
    letterSpacing: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral.gray600,
    fontWeight: '400',
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: colors.neutral.gray900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.neutral.beige,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.beige,
  },
  sectionNumberWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.atb.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  sectionTitleWrapper: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 12,
    color: colors.neutral.gray500,
    fontWeight: '500',
  },
  formGrid: {
    gap: 16,
  },
  fieldGroup: {
    flex: 1,
  },
  fullWidth: {
    flexBasis: '100%',
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.gray700,
  },
  optionalLabel: {
    color: colors.neutral.gray500,
  },
  requiredIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.atb.red,
    marginLeft: 2,
  },
  modernDropdown: {
    borderColor: colors.neutral.gray300,
    borderRadius: 10,
    height: 48,
  },
  textInputContainer: {
    height: 48,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 14,
    color: colors.neutral.gray900,
    fontWeight: '500',
    padding: 0,
  },
  dateInput: {
    borderColor: colors.neutral.gray300,
    borderRadius: 10,
    height: 48,
  },
  currencyInputContainer: {
    height: 48,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.gray600,
    marginRight: 8,
  },
  currencyInput: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral.gray900,
    fontWeight: '500',
    padding: 0,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(200, 35, 51, 0.05)',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(200, 35, 51, 0.1)',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: colors.neutral.gray700,
    fontWeight: '500',
    lineHeight: 18,
  },
  securityCard: {
    marginTop: 15,
    padding: 16,
    backgroundColor: colors.neutral.offWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral.beige,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.gray800,
  },
  securityText: {
    fontSize: 12,
    color: colors.neutral.gray600,
    lineHeight: 18,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.atb.red,
  },
  continueButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.atb.red,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 24,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  footerDivider: {
    width: 40,
    height: 2,
    backgroundColor: colors.neutral.gray300,
    borderRadius: 1,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 11,
    color: colors.neutral.gray500,
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    color: colors.neutral.gray400,
    fontWeight: '400',
  },
});

export default PersonalDataForm;