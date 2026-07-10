import {View, Text, Pressable, ImageBackground} from 'react-native';
import { MaterialCommunityIcons  } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen(){
  const router = useRouter();

  return (

    <ImageBackground source={require("../../assets/images/bg_image.png")}
      resizeMode = "cover"
      className='flex-1'
    >
      <View className='flex-1 mt-32 pt-4'>

        <View className='ml-6'>
          <Text className='font-semibold text-lg color-white'>Asalam O Alaikum,</Text>
          <Text className='font-bold text-2xl color-[#febd71]'>Community Member</Text>
          <Text className='font-semibold text-base color-white'>May Allah Bless Your Day</Text>
        </View>

        <View className='flex-1 bg-[#fefefd] rounded-t-3xl px-5 py-5 mt-28 gap-5'>

          <Pressable className="rounded-2xl flex-row items-center p-4 border border-[#d6a85c]"
          onPress = {() => router.push("/majlis-alert")}
          >

            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#0b6b5a]">
              <MaterialCommunityIcons name="map-marker-outline" size={26} color="#fefefd" />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">
                Majlis Alert
              </Text>

              <Text className="mt-1 text-sm text-gray-600">
                Find upcoming majlis near you
              </Text>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={26} color="#b47a2b" />
          </Pressable>

          <Pressable className="flex-row items-center rounded-2xl bg-white p-4 border border-[#d6a85c]">

            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#0b6b5a]">
              <MaterialCommunityIcons name="clock-outline" size={26} color="#fefefd" />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">
                Prayer Times
              </Text>

              <Text className="mt-1 text-sm text-gray-600">
                View daily prayer times
              </Text>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={26} color="#b47a2b" />
          </Pressable>

          <Pressable className="flex-row items-center rounded-2xl bg-white p-4 border border-[#d6a85c]">

            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#0b6b5a]">
              <MaterialCommunityIcons name="calendar-outline" size={26} color="#fefefd" />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">
                Events
              </Text>

              <Text className="mt-1 text-sm text-gray-600">
                Browse community events
              </Text>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={26} color="#b47a2b" />
          </Pressable>

          <Pressable className="flex-row items-center rounded-2xl bg-white p-4 border border-[#d6a85c]">

            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#0b6b5a]">
              <MaterialCommunityIcons name="newspaper" size={26} color="#fefefd" />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">
                Community News
              </Text>

              <Text className="mt-1 text-sm text-gray-600">
                Stay updatedwith latest news
              </Text>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={26} color="#b47a2b" />
          </Pressable>

          <Pressable className="flex-row items-center rounded-2xl bg-white p-4 border border-[#d6a85c]">

            <View className="h-14 w-14 items-center justify-center rounded-full bg-[#0b6b5a]">
              <MaterialCommunityIcons name="hand-heart-outline" size={26} color="#fefefd" />
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">
               Donations
              </Text>

              <Text className="mt-1 text-sm text-gray-600">
               Support community initiatives
              </Text>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={26} color="#b47a2b" />
          </Pressable>

        </View>
      </View>

    </ImageBackground>
  );
}
