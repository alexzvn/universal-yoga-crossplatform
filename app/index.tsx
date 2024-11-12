import { Layout, Text } from "@ui-kitten/components"
import { useRouter } from "expo-router"
import { useEffect } from "react"
import { auth } from '@/firebase'

export default () => {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      auth.currentUser
        ? router.push('/home')
        : router.push('/auth')
    }, 1_500)
  }, [])

  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category='h1'>Universal Yoga</Text>
      <Text  category='h6' style={{ marginTop: 10 }}>Customer App</Text>
    </Layout>
  )
}