import {View, Text, Pressable} from 'react-native'
import { useRouter } from 'expo-router';

export default function MajlisAlertCard() {
const router = useRouter();
  return (
    <View className='flex-1 items-center justify-center bg-[#fefefd]'>
      <Pressable onPress={() => router.push("/majlis-alert")}>
        <Text className='font-bold text-[#0b6b5a]'>Go to Majlis Alert Screen</Text>
      </Pressable>
    </View>
  );
}
