import { Layout, Text, Button, Card, Icon, TopNavigation, IconElement, Modal } from "@ui-kitten/components";
import { StyleSheet, ScrollView, SafeAreaView, View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Course, Order, Schedule, WithId } from "@/constants/Type";
import { addDoc, collection, doc, documentId, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { auth, firestore } from "@/firebase";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import Toast from "react-native-toast-message";

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
  scheduleCard: {
    marginBottom: 10,
  },
  priceText: {
    marginTop: 10,
  }
});

type BookDialogProps = {
  onDismiss?: () => unknown
  onConfirm?: () => unknown
  course: WithId<Course>
  schedule: WithId<Schedule>
}

const BookDialog = ({ onConfirm, onDismiss, course, schedule }: BookDialogProps) => {
  const hour = (course.start_time / 60) | 0
  const minute = course.start_time % 60

  const date = dayjs(schedule.start_date)
    .set('hour', hour)
    .set('minute', minute)
  

  return (
    <Modal visible={true} backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
      <Card disabled={true}>
        <Text category="h6">Confirm Booking</Text>
        
        <View style={{ marginTop: 15 }}>
          <Text category="s1">{course.title}</Text>
          <Text category="s2">
            {date.format('MMM D, YYYY h:mm A')}
          </Text>
          <Text category="s2">Teacher: {schedule.teacher}</Text>
          {schedule.comment && (
            <Text category="s2">Note: {schedule.comment}</Text>
          )}
          
          <Text category="s1" style={{ marginTop: 10 }}>
            Price: ${course.price}
          </Text>
        </View>

        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'flex-end',
          marginTop: 20,
          gap: 10
        }}>
          <Button
            appearance="ghost" 
            onPress={onDismiss}
          >
            Cancel
          </Button>
          <Button onPress={onConfirm}>
            Confirm Payment
          </Button>
        </View>
      </Card>
    </Modal>
  )
}

export default function CourseScreen() {
  const { course: courseId } = useLocalSearchParams();
  const router = useRouter()
  const [course, setCourse] = useState<WithId<Course> | null>(null);
  const [schedules, setSchedules] = useState(new Array<WithId<Schedule>>)
  const [orders, setOrders] = useState(new Array<WithId<Order>>)
  const [booking, setBooking] = useState<{
    course: WithId<Course>
    schedule: WithId<Schedule>
  }>()

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      const courseRef = doc(firestore, 'courses', courseId as string);
      const courseSnap = await getDoc(courseRef);

      if (! courseSnap.exists()) {
        return
      }

      setCourse({
        id: courseSnap.id,
        ...courseSnap.data() as Course
      });

      const { docs } = await getDocs(
        query(
          collection(firestore, 'schedules'),
          where('course_nano_id', '==', courseSnap.id),
          // orderBy('start_date', 'desc')
        )
      )

      const schedules = docs
        .filter(it => it.exists())
        .map(it => ({ ...it.data(), id: it.id }) as WithId<Schedule>)
        .sort((a, b) => a.start_date - b.start_date)

      setSchedules(schedules)
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const ref = query(
      collection(firestore, 'orders'),
      where('user_id', '==', auth.currentUser!.uid)
    )

    return onSnapshot(ref, (snapshot) => {
      const ordersData: WithId<Order>[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data() as Order,
        });
      });

      setOrders(ordersData);
    })
  })

  const capitalize = (val: string) => String(val).charAt(0).toUpperCase() + String(val).slice(1);

  if (!course) {
    return (
      <Layout style={styles.container}>
        <SafeAreaView>
          <Text>Loading...</Text>
        </SafeAreaView>
      </Layout>
    );
  }

  const hour = (course.start_time / 60) | 0
  const minute = course.start_time % 60
  const now = dayjs().set('hour', hour).set('minute', minute)

  return (
    <Layout style={styles.container}>
      {booking &&
        <BookDialog
          {...booking}
          onDismiss={() => setBooking(undefined)}
          onConfirm={async () => {
            const order: Order = {
              user_id: auth.currentUser!.uid,
              course_nano_id: booking.course.id,
              schedule_nano_id: booking.schedule.id,
              price: booking.course.price,
              created_at: Date.now()
            }

            addDoc(collection(firestore, 'orders'), order)
              .then(() => {
                Toast.show({ type: 'success', text1: 'Order placed' })
                setBooking(undefined)
              })
              .catch(() => {
                Toast.show({ type: 'error', text1: 'Cant place order right now' })
              })
          }}
        />
      }

      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Layout style={styles.header}>
            <Pressable onPress={() => router.back()} style={{ marginBottom: 15 }}>
            <Icon name="arrow-back" style={{ height: 30, width: 30 }} />
            </Pressable>

            <Text category="h1">{course.title}</Text>
            <Text category="s1" appearance="hint">
              {capitalize(course.day_of_week.toLowerCase())}
              {' - '}
              {now.format('h:mm A')}
            </Text>
          </Layout>

          <Layout style={styles.section}>
            <Text category="h5">Price</Text>
            <Text>${course.price}</Text>
          </Layout>

          <Layout style={styles.section}>
            <Text category="h6" style={styles.sectionTitle}>About</Text>
            <Text>{course.description || 'No description available.'}</Text>
          </Layout>

          <Layout style={styles.section}>
            <Text category="h6" style={styles.sectionTitle}>Details</Text>
            <Text>Duration: {course.duration} minutes</Text>
            <Text>Capacity: {course.capacity} people</Text>
            <Text>Type: {capitalize(course.type.replace(/_/, ' ').toLowerCase())}</Text>
          </Layout>

          <Layout style={styles.section}>
            <Text category="h6" style={styles.sectionTitle}>Schedule</Text>

            {schedules.map((schedule, index) => {
              const date = dayjs.unix(schedule.start_date / 1000)
              const now = dayjs()

              return (
                <Card key={schedule.id} style={[styles.scheduleCard, { marginBottom: 10 }]}>
                  <Text category="s1">
                    {date.format('DD/MM/YYYY')}
                    {' - '}
                    {schedule.teacher}
                  </Text>
                  { schedule.comment &&
                    <Text style={{ marginTop: 5 }}>{schedule.comment}</Text>
                  }
  
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                    <Button
                      size="small"
                      disabled={now.isAfter(date) || orders.some(order => order.schedule_nano_id === schedule.id)}
                      onPress={() => setBooking({ course, schedule })}
                    >
                      Book Now
                    </Button>
                  </View>
                </Card>
              )
            })}

          </Layout>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
}
