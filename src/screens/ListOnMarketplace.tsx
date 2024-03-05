import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import NFTDisplayComponent from '../components/NFTDisplayComponent';
import { WalletClient, useWalletClient } from 'wagmi';
import { approve_nft, list_nft } from '../web3/contract-interaction';
import { bscTestnet } from 'viem/chains';

const ListOnMarketplace = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [listPrice, setListPrice] = useState('');
  const { name, rarity, imageUrl, tokenID } = route.params;
  let wc: WalletClient;
  const { data: walletClient } = useWalletClient({
    chainId: bscTestnet.id,
    onError(error) {
      console.log('Error', error)
    }
  })
  wc = walletClient;
  const write = async () => {
    setLoading(true)
    //approve
    await approve_nft(tokenID, wc).then(async (success) => {
      //if approved
      if (success) {
        await list_nft(tokenID, wc, Number(listPrice) * (10 ** 18));
      } else {
        throw new Error("Approve call failed");
      }
    });
    navigation.navigate("Marketplace");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List PixelPal on Market</Text>

      <NFTDisplayComponent name={name} rarity={rarity} imageUrl={imageUrl} />

      {/* Price Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>List Price in tBNB</Text>
        <TextInput
          style={styles.input}
          value={listPrice}
          onChangeText={setListPrice}
          keyboardType="numeric"
          placeholder="Enter price"
        />
      </View>

      {/* Action Buttons */}
      {
        loading ? <ActivityIndicator /> : (
          <TouchableOpacity style={styles.button} onPress={() => { write() }} disabled={!write}>
            <Text style={styles.buttonText}>List on Market</Text>
          </TouchableOpacity>
        )
      }
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
    fontSize: 22,
    fontFamily: "PixelifySans",
    fontWeight: 'bold',
    marginBottom: 20,
  },
  nftContainer: {
    marginBottom: 20,
    // Add styles for your NFT component
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "PixelifySans",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
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

export default ListOnMarketplace;
