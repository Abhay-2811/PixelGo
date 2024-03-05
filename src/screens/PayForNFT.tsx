import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {WalletClient, useWalletClient } from 'wagmi';
import { bscTestnet } from 'viem/chains';
import { pay_for_nft } from '../web3/contract-interaction';
import NFTDisplayComponent from '../components/NFTDisplayComponent';
const PayForNFT = ({ route, navigation }) => {
  const { name, rarity, imageUrl, tokenID, price } = route.params;
  let wc: WalletClient;
  const { data: walletClient } = useWalletClient({
    chainId: bscTestnet.id,
    onError (error) {
      console.log('Error', error)
    }
  })
  wc = walletClient;
  // Placeholder for payment logic
  const handlePayment = async () => {
    // payment logic
    console.log(price);
    await pay_for_nft(tokenID, wc, price);
    console.log(`Paying ${price} tBNB on BSC`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchase your Pixel#{tokenID}</Text>
      <Text style={styles.subtitle}>
        Pay for the NFT on BSC Testnet.
      </Text>

      <NFTDisplayComponent name={name} rarity={rarity} imageUrl={imageUrl} />

      {/* Purchase Button */}
      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Purchase for {Number(price)/10**18} TBNB</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8ffde',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: "PixelifySans",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "PixelifySans",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "PixelifySans",
  },
  button: {
    backgroundColor: '#C6FF00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontFamily: "PixelifySans",
    fontSize: 16,
  },
});

export default PayForNFT;
