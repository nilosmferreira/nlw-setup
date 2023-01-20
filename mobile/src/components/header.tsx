import { Text, TouchableOpacity, View } from 'react-native';
import Logo from '../assets/logo.svg';
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

export function Header() {
  return (
    <View className='w-full flex-row items-center justify-between'>
      <Logo />
      <TouchableOpacity
        activeOpacity={0.7}
        className='border border-violet-500 rounded-lg px-4 flex-row items-center h-11'
      >
        <Feather
          name='plus'
          color={colors.violet[500]}
          size={20}
        />
        <Text className='text-white ml-3 font-semibold text-base'>Novo</Text>
      </TouchableOpacity>
    </View>
  );
}
