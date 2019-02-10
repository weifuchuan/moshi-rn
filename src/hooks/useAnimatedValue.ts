import { useState } from "react";
import { Animated } from "react-native";


export default function useAnimatedValue(init:number = 0): Animated.Value{
  const [value] = useState(new Animated.Value(init)); 
  return value; 
}