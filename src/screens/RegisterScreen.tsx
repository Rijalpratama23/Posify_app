import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const COLORS = {
  background: '#DDE1F5',
  card: '#FFFFFF',
  primary: '#1A237E',
  inputBg: '#DDE1F5',
  textMain: '#1A237E',
  textGrey: '#6B7280',
  accent: '#4F46E5',
  google: '#EA4335',
  apple: '#000000',
  facebook: '#1877F2',
};

const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* --- PERUBAHAN DI SINI --- */}
        {/* 1. Logo diletakkan DI LUAR ScrollView agar tetap diam di atas */}
        <View style={styles.headerContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        {/* 2. ScrollView hanya membungkus Card Putih */}
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.subTitle}>Posify login now!</Text>

            {/* Input Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="example@gmail.com" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            {/* Input Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput} placeholder="••••••" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry={!isPasswordVisible} />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <MaterialCommunityIcons name={isPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#4B5563" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.rowBetween}>
              <TouchableOpacity style={styles.rememberRow} onPress={() => setRememberMe(!rememberMe)}>
                <MaterialCommunityIcons name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color={COLORS.textMain} />
                <Text style={styles.rememberText}>Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Tombol Login */}
            <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={() => navigation.replace('Home')}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Divider "Or" */}
            <View style={styles.orContainer}>
              <Text style={styles.orText}>Or</Text>
            </View>

            {/* Social Media Icons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialIcon}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} style={{ width: 30, height: 30 }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome name="apple" size={32} color={COLORS.apple} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome name="facebook" size={30} color={COLORS.facebook} />
              </TouchableOpacity>
            </View>

            {/* Footer Sign Up */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Agar card tetap di tengah jika konten sedikit
    paddingHorizontal: 20,
    paddingBottom: 30, // Memberi ruang scroll di bawah
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 10, // Diatur agar pas di atas
    marginBottom: 10,
    zIndex: 1, // Memastikan logo di atas layer
  },
  logo: {
    width: 160,
    height: 140, // Sedikit dikecilkan agar proporsional sebagai header fixed
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  // ... (Style di bawah ini TIDAK BERUBAH sama sekali) ...
  title: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: '#333',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 5,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 13,
  },
  forgotText: {
    color: '#577CFF',
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  orText: {
    color: '#6B7280',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  socialIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signUpText: {
    color: '#1A237E',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RegisterScreen;
