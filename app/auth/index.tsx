import { ImageProps, Pressable, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Layout, Text, Input, Button, Spinner, Icon, IconProps } from "@ui-kitten/components";
import { useState } from "react";
import { auth } from "@/firebase";
import {Keyboard} from 'react-native'
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import LoadingIndicator from "@/components/LoadingIndicator";
import { signInWithEmailAndPassword } from "firebase/auth";


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

export default function Auth() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleLogin = async () => {
    Keyboard.dismiss()

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push('/home');
      })
      .catch((error) => {
        Toast.show({
          text1: 'Invalid email or password',
          type: 'error',
          position: 'bottom',
        });
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <Layout style={styles.container}>
      <Text category="h2" style={{ marginBottom: 10 }}>Sign In</Text>
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
        secureTextEntry={true}
        selectTextOnFocus={false}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        autoComplete="off"
      />

      <Button
        style={styles.button}
        onPress={handleLogin}
        accessoryLeft={loading ? LoadingIndicator : undefined}
        disabled={loading}
      >
        Login
      </Button>

      <Button appearance="ghost" status="basic" style={styles.buttonGhost} onPress={() => router.push('/auth/register')}>
        Register an account?
      </Button>
    </Layout>
  )
}