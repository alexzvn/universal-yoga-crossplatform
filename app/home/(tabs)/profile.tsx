import { Layout, Text, Button } from "@ui-kitten/components";
import { SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth } from '@/firebase';
import { useState, useEffect } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: '#8F9BB3',
    marginBottom: 5,
  },
  button: {
    marginTop: 30,
  }
});

export default function ProfileScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || "");
    }
  }, []);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        router.push('/auth');
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <Layout style={styles.header}>
          <Text category="h1">Your Profile</Text>
        </Layout>

        <Layout style={styles.section}>
          <Text style={styles.label}>First Name</Text>
          <Text category="s1">Not set</Text>
        </Layout>

        <Layout style={styles.section}>
          <Text style={styles.label}>Last Name</Text>
          <Text category="s1">Not set</Text>
        </Layout>

        <Layout style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text category="s1">{userEmail}</Text>
        </Layout>

        <Button
          status="danger"
          style={styles.button}
          onPress={handleSignOut}
        >
          Sign Out
        </Button>
      </SafeAreaView>
    </Layout>
  );
}
