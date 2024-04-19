import React from 'react'
import { ImageBackground, Text, View } from 'react-native'

export default function GoldRush() {
  return (
    <View className='bg-[#12090A] w-full h-full justify-center items-center'>
        <ImageBackground source={require('../../assets/GoldRush/GoldRush-Bg.png')} className='w-[400px] h-[400px]'>
            <Text className='text-white absolute top-[82px] right-[120px]'>1</Text>
            <Text className='text-white absolute top-24 right-[200px]'>2</Text>
            <Text className='text-white absolute top-[130px] left-[115px]'>3</Text>
            <Text className='text-white absolute top-[195px] left-[90px]'>4</Text>
            <Text className='text-white absolute top-[165px] right-[215px]'>5</Text>
            <Text className='text-white absolute top-[153px] right-[140px]'>6</Text>
            <Text className='text-white absolute top-[145px] right-[65px]'>7</Text>
            <Text className='text-white absolute bottom-[145px] left-[160px]'>8</Text>
            <Text className='text-white absolute bottom-[155px] right-[165px]'>9</Text>
            <Text className='text-white absolute bottom-[175px] right-[75px]'>10</Text>
        </ImageBackground>
    </View>
  )
}
