import { ImageProps, SafeAreaView, StyleSheet, View } from "react-native";
import { Layout, Text, Input, Button, Spinner } from "@ui-kitten/components";
import { useState } from "react";
import { auth } from "@/firebase";
import { Keyboard } from 'react-native';
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import LoadingIndicator from "@/components/LoadingIndicator";
import { createUserWithEmailAndPassword } from "firebase/auth";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 10,
    width: '100%',
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  buttonGhost: {
    marginTop: 20,
    width: '100%',
  },
});

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const router = useRouter();

  const handleRegister = async () => {
    Keyboard.dismiss();

    setError(undefined);

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!email.includes('@')) {
      return setError('Invalid email');
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Toast.show({
          text1: 'Registration successful',
          type: 'success',
          position: 'bottom',
        });

        router.push('/home');
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout style={styles.container}>
      <Text category="h2" style={{ marginBottom: 10 }}>Register Account</Text>]
      <Text category="s1"  style={{ marginBottom: 50 }}>Universal Yoga for Customer</Text>

      <Input
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoComplete="off"
      />
      
      <Input
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        autoComplete="off"
      />

      <Input
        placeholder="Confirm password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoComplete="off"
      />

      {error && <Text category="label" style={{ color: 'red' }}>{error}</Text>}

      <Button
        style={styles.button}
        onPress={handleRegister}
        accessoryLeft={loading ? LoadingIndicator : undefined}
        disabled={loading}
      >
        Sign Up
      </Button>

      <Button 
        appearance="ghost" 
        status="basic" 
        style={styles.buttonGhost}
        onPress={() => router.push('/auth')}
      >
        Already have an account?
      </Button>
    </Layout>
  );
}
