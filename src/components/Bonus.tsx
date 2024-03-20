import { View, Text } from 'react-native'
import React from 'react'

interface types {
    title: string
}

export default function Bonus({title}: types) {
  return (
    <View className='w-[110px] h-[125px] justify-center items-center'>
        <View className='w-full h-[105px] bg-[#222222] rounded-md' />
        <View className='w-full h-[2px] bg-[#FAB300] rounded-md mt-2' />
      <Text className='text-white mt-1'>{title}</Text>
    </View>
  )
}