import { Layout, Spinner } from "@ui-kitten/components";
import React from "react";
import { ImageProps, View } from "react-native";


export default function LoadingIndicator() {
  return (
    <View>
      <Spinner status="basic" size="small" />
    </View>
  )
}