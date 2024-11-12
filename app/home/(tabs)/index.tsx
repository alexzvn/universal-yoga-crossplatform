import { Layout, Text, Button, Card } from "@ui-kitten/components";
import { StyleSheet, ScrollView, SafeAreaView, ViewStyle, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Course, WithId } from "@/constants/Type";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase";
import { StyleProps } from "react-native-reanimated";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
  }
});

const CourseCard = ({ course, style }: { course: WithId<Course>, style?: StyleProps }) => {

  const capitalize = (val: string) => String(val).charAt(0).toUpperCase() + String(val).slice(1)

  return (
    <Card 
      style={style}
      header={() => (
        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
          <Text category="h6">{course.title}</Text>
          <Text category="s1" style={{marginTop: 5}}>
            ${course.price}
            {' - '}
            {capitalize(course.type.toLowerCase().replace(/_/, ' '))}
            {' - '}
            { capitalize(course.day_of_week.toLowerCase()) }
          </Text>
        </View>
      )}

      footer={() => (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 15, paddingVertical: 10}}>
          <View />
          <Button size="small">
            Book Now
          </Button>
        </View>
      )}
    >

      <Text category="s1">Duration: {course.duration} minutes</Text>
      <Text category="s1">Capacity: {course.capacity} people</Text>
      {course.description && <Text category="s2" style={{ marginTop: 10 }}>{course.description}</Text>}

    </Card>
  )
}


export default function HomeScreen() {
  const router = useRouter();

  const [courses, setCourses] = useState(new Array<WithId<Course>>);

  useEffect(() => {
    // Set up realtime listener for courses
    const coursesRef = collection(firestore, 'courses');

    const unsubscribe = onSnapshot(coursesRef, (snapshot) => {
      const coursesData: WithId<Course>[] = [];
      snapshot.forEach((doc) => {
        coursesData.push({
          id: doc.id,
          ...doc.data() as Course,
        });
      });

      setCourses(coursesData);

    }, (error) => {
      console.error("Error fetching courses:", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Layout style={styles.header}>
            <Text category="h1">Welcome</Text>
            <Text category="s1">Find your next yoga class</Text>
          </Layout>

          <Layout style={styles.section}>
            <Text category="h6" style={styles.sectionTitle}>Available Classes</Text>
            {courses.map(course => (
              <CourseCard course={course} style={{ marginBottom: 10 }} />
            ))}
            {courses.length === 0 && (
              <Text appearance="hint">No classes available</Text>
            )}
          </Layout>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
}
