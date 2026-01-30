import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert, // TAMBAHAN: Untuk pesan pop-up
  ActivityIndicator, // TAMBAHAN: Untuk loading muter-muter
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

// --- 1. IMPORT FIREBASE ---
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase'; // Pastikan path ini benar sesuai struktur foldermu

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // --- 2. STATE LOADING ---
  const [isLoading, setIsLoading] = useState(false);

  // --- 3. FUNGSI REGISTER KE FIREBASE ---
  const handleRegister = async () => {
    // Validasi Input Kosong
    if (!name || !email || !password) {
      Alert.alert('Gagal', 'Mohon isi Nama, Email, dan Password.');
      return;
    }

    // Validasi Terms
    if (!agreeTerms) {
      Alert.alert('Gagal', 'Anda harus menyetujui Syarat & Ketentuan.');
      return;
    }

    setIsLoading(true); // Mulai Loading

    try {
      // A. Buat Akun di Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // B. Simpan Nama User (DisplayName)
      await updateProfile(user, {
        displayName: name,
      });

      console.log('Register Berhasil:', user.email);

      // C. Beri Notifikasi & Pindah ke Home
      Alert.alert('Sukses', 'Akun berhasil dibuat!', [{ text: 'OK', onPress: () => navigation.replace('Home') }]);
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Terjadi kesalahan.';

      // Cek Kode Error dari Firebase
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email sudah terdaftar!';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password terlalu lemah (min. 6 karakter).';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid.';
      }

      Alert.alert('Registrasi Gagal', errorMessage);
    } finally {
      setIsLoading(false); // Stop Loading
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          {/* Pastikan path logo benar */}
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.title}>Create an account</Text>

            {/* Input Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} />
            </View>

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

            {/* Checkbox Terms */}
            <View style={styles.rowStart}>
              <TouchableOpacity style={styles.rowItem} onPress={() => setAgreeTerms(!agreeTerms)}>
                <MaterialCommunityIcons name={agreeTerms ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color={COLORS.textMain} />
                <Text style={styles.termsText}>
                  I agree to the <Text style={{ color: COLORS.accent }}>Term of Service</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* --- 4. TOMBOL REGISTER YANG SUDAH DIUPDATE --- */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleRegister} // Memanggil fungsi handleRegister
              disabled={isLoading} // Tombol mati saat loading
            >
              {isLoading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.buttonText}>Register</Text>}
            </TouchableOpacity>

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

            {/* Footer: Balik ke Login */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Login</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  logo: {
    width: 160,
    height: 140,
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
  title: {
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
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 5,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 13,
  },
  button: {
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
  buttonText: {
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
  linkText: {
    color: '#1A237E',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RegisterScreen;
