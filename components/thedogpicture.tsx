import { theDogApi }  from '../api/thedogapi/index';
import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

//tän voi nakata pois ja value kanssa pois
type DogPictureProps = {
    value: {
        BackgroundC: string;
    }
}

export const TheDogPicture: React.FC<DogPictureProps> = ({ value }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const randomizer = Number(value.BackgroundC.replace('#','0x'));
  
  console.log('TheDogPicture received BackroundC:', randomizer);
 
    useEffect(() => {
    const fetchDogImage = async () => {
        
      try {
        const response = await theDogApi.get('/images/search');
        if (response.data && response.data.length > 0) {
          setImageUrl(response.data[0].url);
        }
        } catch (error) {
        console.error('Error fetching dog image:', error);
        } finally {
        setLoading(false);
        
        }
    };
    
    fetchDogImage();
    
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  } else if (imageUrl) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
    );
  } else {
    return null;
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});