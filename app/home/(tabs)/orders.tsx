import { Text } from "@ui-kitten/components";
import { Layout, Card, Button } from "@ui-kitten/components";
import { StyleSheet, ScrollView, SafeAreaView, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Course, Order, Schedule, WithId } from "@/constants/Type";
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { auth, firestore } from "@/firebase";
import dayjs from "dayjs";

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
  sectionTitle: {
    marginBottom: 10,
  },
  orderCard: {
    marginBottom: 10,
  },
  orderDetails: {
    marginTop: 5,
  },
  priceText: {
    marginTop: 10,
  }
});


export default function BookedScreen() {
  const [orders, setOrders] = useState(new Array<WithId<Order>>());
  const [courses, setCourses] = useState<Record<string, WithId<Course>>>({});
  const [schedules, setSchedules] = useState<Record<string, WithId<Schedule>>>({});

  useEffect(() => {
    // Set up realtime listener for orders
    const ordersRef = query(
      collection(firestore, 'orders'),
      where('user_id', '==', auth.currentUser!.uid),
      orderBy('created_at', 'desc')
    );

    return onSnapshot(ordersRef, (snapshot) => {
      const ordersData: WithId<Order>[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data() as Order,
        });
      });

      setOrders(ordersData);

      // Fetch related courses and schedules
      const courseIds = [...new Set(ordersData.map(order => order.course_nano_id))];
      const scheduleIds = [...new Set(ordersData.map(order => order.schedule_nano_id))];

      courseIds.forEach(async (courseId) => {
        const courseRef = doc(firestore, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          setCourses(prev => ({
            ...prev,
            [courseId]: {
              id: courseSnap.id,
              ...courseSnap.data() as Course
            }
          }));
        }
      });

      scheduleIds.forEach(async (scheduleId) => {
        const scheduleRef = doc(firestore, 'schedules', scheduleId);
        const scheduleSnap = await getDoc(scheduleRef);
        if (scheduleSnap.exists()) {
          setSchedules(prev => ({
            ...prev,
            [scheduleId]: {
              id: scheduleSnap.id,
              ...scheduleSnap.data() as Schedule
            }
          }));
        }
      });

    }, (error) => {
      console.error("Error fetching orders:", error);
    });
  }, []);

  const capitalize = (val: string) => String(val).charAt(0).toUpperCase() + String(val).slice(1);

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Layout style={styles.header}>
            <Text category="h1">Your Orders</Text>
          </Layout>

          <Layout style={styles.section}>
            {Object.values(schedules).map(schedule => {
              const matchingOrders = orders.filter(order => order.schedule_nano_id === schedule.id);
              const course = courses[matchingOrders[0]?.course_nano_id];
              
              if (!course || matchingOrders.length === 0) return null;

              const date = dayjs.unix(schedule.start_date / 1000);
              const hour = (course.start_time / 60) | 0;
              const minute = course.start_time % 60;
              const time = date.set('hour', hour).set('minute', minute);

              return (
                <Card key={schedule.id} style={{ marginBottom: 10 }}>
                  <Text category="h6">{course.title}</Text>
                  <Text category="s1">
                    {date.format('MMM D, YYYY')} at {time.format('h:mm A')}
                  </Text>
                  <Text category="s1">Teacher: {schedule.teacher}</Text>
                  <Text category="s1">Type: {capitalize(course.type.toLowerCase().replace(/_/g, ' '))}</Text>
                  <Text category="s1" style={{ marginTop: 10 }}>Price: ${matchingOrders[0].price}</Text>
                  {schedule.comment && (
                    <Text category="s2" style={{ marginTop: 5 }}>Note: {schedule.comment}</Text>
                  )}
                </Card>
              );
            })}
            {orders.length === 0 && (
              <Text appearance="hint">No orders found</Text>
            )}
          </Layout>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
}