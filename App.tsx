// ⚠️ Important: `@walletconnect/react-native-compat` needs to be imported before other `wagmi` packages.
// This is because Web3Modal has a polyfill necessary for the TextEncoder API.
import '@walletconnect/react-native-compat';
import React, { useState } from 'react';
import { ActivityIndicator, View } from "react-native";
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { useAccount } from 'wagmi';
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
} from '@web3modal/wagmi-react-native';
import { WagmiConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Wallet from './src/screens/Wallet';
import ProfileScreen from './src/screens/ProfileScreen';
import Explore from './src/screens/Explore';
import Marketplace from './src/screens/Marketplace';
import ListOnMarketplace from './src/screens/ListOnMarketplace';
import Battle from './src/screens/Battle';
import YouWon from './src/screens/YouWon';
import YouLost from './src/screens/YouLost';
import PayForNFT from './src/screens/PayForNFT';
import BuyCrypto from './src/screens/BuyCrypto';
import MintFirstNFT from './src/screens/MintFirstNFT';
import { user_nft_balance } from './src/web3/contract-interaction';
const projectId = process.env.EXPO_PUBLIC_WALLETCONNECT_CLOUD_PROJECT_ID;

// Metadata to show about the dApp when deep-linking to the wallet
const metadata = {
  name: 'PixelGo',
  description: 'PixelGo app connection request',
  url: 'https://callstack.com/',
  icons: ['https://avatars.githubusercontent.com/u/42239399'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

// Chains that will be supported by the dApp
const chains = [bsc, bscTestnet];

// Create wagmi config
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// Create actual Web3Modal instance
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  defaultChain: bscTestnet
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MyTabs({ navigation }) {
  const [nftCount, setNftCount] = useState(null);
  const [finished, setFinished] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);

  const { address } = useAccount({
    onConnect: async ({ address }) => {
      // check balance of user
      const data = await user_nft_balance(address);
      setNftCount(Number(data));
      setLoadingUserData(false);
    }
  })

  if (!address)
    return <Wallet navigation={navigation} />

  if (loadingUserData)
    return <ActivityIndicator />

  if (!nftCount && !finished)
    return <MintFirstNFT navigation={navigation} setFinished={() => setFinished(true)} />


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: { fontFamily: "PixelifySans" },
        tabBarStyle: {
          paddingHorizontal: 5,
          paddingTop: 0,
          backgroundColor: '#C6FF00',
          position: 'absolute',
          borderTopWidth: 0,
        },
        headerTitleStyle: {
          fontFamily: "PixelifySans",
        },
        headerStyle: {
          backgroundColor: '#C6FF00',
        },
        tabBarActiveTintColor: "#000000"
      })}
    >
      {
        address && <Tab.Screen name="Profile" component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={27} color={color} />
          }}
        />
      }
      <Tab.Screen name="Explore" component={Explore}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="explore" size={27} color={color} />
        }}
      />
      <Tab.Screen name="Marketplace" component={Marketplace}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="local-convenience-store" size={27} color={color} />
        }}
      />
      {/* ... other tab screens */}
    </Tab.Navigator>
  );
}

function App() {
  const [fontsLoaded] = useFonts({
    'PixelifySans': require('./assets/PixelifySans.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <Web3Modal />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: {
              paddingHorizontal: 5,
              paddingTop: 0,
              backgroundColor: '#C6FF00',
              position: 'absolute',
              borderTopWidth: 0,
            },
            headerTitleStyle: {
              fontFamily: "PixelifySans",
            },
            headerStyle: {
              backgroundColor: '#C6FF00',
            },
            tabBarActiveTintColor: "#000000"
          })}>
          <Stack.Screen name="Home" component={MyTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Wallet" component={Wallet} />
          <Stack.Screen name="Battle" component={Battle} />
          <Stack.Screen name="PayForNFT" component={PayForNFT} options={{ title: "", headerBackTitle: "Market" }} />
          <Stack.Screen name="ListOnMarketPlace" component={ListOnMarketplace} options={{ title: "", headerBackTitle: "Profile" }} />
          <Stack.Screen name="YouWon" component={YouWon} options={{ title: "You Won", headerBackVisible: false }} />
          <Stack.Screen name="YouLost" component={YouLost} options={{ title: "You Lost", headerBackVisible: false }} />
          <Stack.Screen name="BuyCrypto" component={BuyCrypto} options={{ title: "Buy Crypto" }} />
          {/* ... other non-tab screens */}
        </Stack.Navigator>
      </NavigationContainer>
    </WagmiConfig>
  );
}

export default App;