import { Tabs } from 'expo-router';
import { BottomNavigation, BottomNavigationTab, Icon, Layout } from '@ui-kitten/components';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const PersonIcon = (props: any) => (
  <Icon {...props} name='person-outline'/>
);

export const OrderIcon = (props: any) => (
  <Icon {...props} name='list-outline'/>
);

export const HomeIcon = (props: any) => (
  <Icon {...props} name='home-outline'/>
);

function TabLayout(props: BottomTabBarProps): any {

  const onSelect = (index: number) => {
    props.navigation.navigate(props.state.routeNames[index]);
  }

  return (
    <Layout>
      <SafeAreaView>
        <BottomNavigation {...props} onSelect={onSelect} selectedIndex={props.state.index}>
          <BottomNavigationTab icon={HomeIcon} title="Home" />
          <BottomNavigationTab icon={OrderIcon} title="Orders" />
          <BottomNavigationTab icon={PersonIcon} title="Profile" />
        </BottomNavigation>
      </SafeAreaView>
    </Layout>
  );
}

export default function HomeTab() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={TabLayout}>
      <Tabs.Screen name='index'/>
      <Tabs.Screen name='orders'/>
      <Tabs.Screen name='profile'/>
    </Tabs>
  )
}