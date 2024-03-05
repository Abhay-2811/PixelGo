import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { mint_first } from '../web3/contract-interaction';
import { useAccount } from 'wagmi';
import { possible_Tokens } from '../web3/contract-interaction';

const MintFirstNFT = ({ navigation, setFinished }) => {
  // const navigation = useNavigation();  
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const mint_nft = async () => {
    if (!address) {
      return
    }

    try {
      setLoading(true);
      const possible_tokens: Array<number> = await possible_Tokens();
      console.log(possible_tokens);
      const tokenID = possible_tokens[Math.floor(Math.random() * (possible_tokens.length - 60 + 1)) + 60]
      await mint_first(tokenID, address);
      navigation.navigate("Home");
      setFinished();
      setLoading(false);
    } catch (e) {
      console.log(e);
      setFinished();
      navigation.navigate("Explore");
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://media.tenor.com/lPo9OU7hx60AAAAC/lilnouns-lil-nouns-dao.gif" }} style={styles.nftImage} />
      <Text style={styles.feedbackText}>Your first Pixel is on us.</Text>

      {loading ? <ActivityIndicator /> : (
        <TouchableOpacity style={styles.claimButton} onPress={mint_nft}>
          <Text style={styles.buttonText}>Claim Your Pixel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8ffde',
  },
  feedbackText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    fontFamily: "PixelifySans",
    padding: 10,
    paddingTop: 0
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    fontFamily: "PixelifySans",
    marginBottom: 20,
    padding: 10,
    paddingTop: 0
  },
  nftImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 20,
  },
  claimButton: {
    alignItems: "center",
    borderColor: '#333',
    borderWidth: 2,
    backgroundColor: '#C6FF00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#333',
    fontFamily: "PixelifySans",
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MintFirstNFT;
