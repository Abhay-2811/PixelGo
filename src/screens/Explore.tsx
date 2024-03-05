import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useContractRead } from 'wagmi';
import { abis, ca } from '../web3/constants/constants';

const Explore = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nfts, setNfts] = useState([
    { id: 4, name: 'Pixel#4', rarity: 'Super-Rare', imageUrl: 'https://ipfs.io/ipfs/bafybeifby6t7jclea4gh44x5yna7cnsvt6ruwvrpvqxnpp6xmf4i4uq2qi/2.png' },
    { id: 36, name: 'Pixel#36', rarity: 'Rare', imageUrl: 'https://ipfs.io/ipfs/bafybeifby6t7jclea4gh44x5yna7cnsvt6ruwvrpvqxnpp6xmf4i4uq2qi/8.png' },
    { id: 46, name: 'Pixel#46', rarity: 'Rare', imageUrl: 'https://ipfs.io/ipfs/bafybeifby6t7jclea4gh44x5yna7cnsvt6ruwvrpvqxnpp6xmf4i4uq2qi/9.png' },
    { id: 76, name: 'Pixel#76', rarity: 'Common', imageUrl: 'https://ipfs.io/ipfs/bafybeifby6t7jclea4gh44x5yna7cnsvt6ruwvrpvqxnpp6xmf4i4uq2qi/11.png' },
    { id: 86, name: 'Pixel#86', rarity: 'Common', imageUrl: 'https://ipfs.io/ipfs/bafybeifby6t7jclea4gh44x5yna7cnsvt6ruwvrpvqxnpp6xmf4i4uq2qi/12.png' },
  ]);

  const random_locations = [4104739, 2898825, 4104896, 2898922, 4105027, 2898869, 4104819, 2898824, 4105061, 2898931];
  console.log(random_locations);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      setLocation({
        latitude: 41.04711,
        longitude: 28.98800,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location || !random_locations) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="black" />
        <Text style={styles.loadingText}>Loading map and Pixels, hold on this might take a second...</Text>
      </View>
    )
  }

  return (
    <MapView
      style={styles.map}
      minZoomLevel={16}
      pitchEnabled={true}
      initialRegion={location}
      showsUserLocation={true}
      userInterfaceStyle='dark'
      showsMyLocationButton={true}
    >
      {nfts.map((nft, index) => (
        <Marker
          key={nft.id}
          coordinate={{ latitude: (Number(random_locations[2 * index]) - 200) / 100000, longitude: (Number(random_locations[(2 * index) + 1]) + 50) / 100000 }}
          title={nft.name}
        >
          <Image source={{ uri: nft.imageUrl }} style={styles.markerImage} />
          <Callout>
            <View style={styles.calloutView}>
              <Image source={{ uri: nft.imageUrl }} style={styles.nftImage} />
              <View style={{ flex: 1, padding: 10 }}>
                <Text style={styles.nftName}>{nft.name}</Text>
                <Text style={styles.nftRarity}>Rarity: {nft.rarity}</Text>
                <TouchableOpacity style={styles.marketplaceButton} onPress={() => navigation.navigate("Battle", { imageURL: nft.imageUrl, tokenID: nft.id })}>
                  <Text style={styles.buttonText}>Battle</Text>
                </TouchableOpacity>
              </View>
              {/* Add distance calculation if needed */}
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerImage: {
    width: 60, // Set the size of the image
    height: 60,
    borderRadius: 60,
    borderColor: "black",
    borderWidth: 3
  },
  nftName: {
    fontFamily: "PixelifySans",
    fontWeight: 'bold',
    fontSize: 16,
  },
  nftRarity: {
    fontFamily: "PixelifySans",
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  calloutView: {
    flex: 1,
    flexDirection: "row",
    width: 250,
    height: 100,
  },
  nftImage: {
    borderRadius: 5,
    marginBottom: 5,
    marginRight: 5,
    width: 100,
    height: 100,
  },
  marketplaceButton: {
    backgroundColor: '#C6FF00',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: "PixelifySans",
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8ffde',
  },
  loadingText: {
    marginTop: 20,
    textAlign: "center",
    padding: 20,
    fontFamily: "PixelifySans",
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  }
});

export default Explore;
