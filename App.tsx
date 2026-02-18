import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  useAudioRecorderState
} from 'expo-audio';
import { TheDogPicture } from './components/thedogpicture';
import { CameraView } from 'expo-camera';
 

export default function App() {
    const [BackgroundC, setBackgroundC] = useState<string>('#fff');
    
    
    // useAudiorecorder hookki asettaa mikin tilan, ja käynnistää db-mittarin
    const audioRecorder = useAudioRecorder({...RecordingPresets.HIGH_QUALITY,
      isMeteringEnabled: true  
    });
    // useAudioRecorderState hookki hakee mikin tilan
    const recorderState = useAudioRecorderState(audioRecorder, 50);
    //gatingin voisi määritellä sliderilla, mutta out of scope tälle projektille
    const gating = -15; // dB raja jolla taustaväri vaihtuu ja taskulamppu syttyy

    // record-funktio käynnistää äänityksen
    const record = async () => {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      
    };
  
    // stopRecording-funktio pysäyttää äänityksen
    const stopRecording = async () => {
      await audioRecorder.stop();
    };
  

    // useEffect pyytää käyttöoikeudet mikkiin ja asettaa äänitilan
    useEffect(() => {
      (async () => {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        
        if (!status.granted) {
          Alert.alert('Permission to access microphone was denied');
        }
      })();
    }, []);


    // kännykän näytön backgroundin värityksen vaihto biitin mukaan
    const BackgroundColorer = () => {
      const hexArray = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f'
      ];
      const a = Math.floor(Math.random() * 16)
      const b = Math.floor(Math.random() * 16)
      const color = '#' + 'f' + hexArray[a] + hexArray[b]
      setBackgroundC(color)
    }

    useEffect(() => {
      if (recorderState.metering !== undefined && recorderState.metering > gating) {
        BackgroundColorer()
       
      }
    }, [recorderState.metering]);
  
  return (
    
    <><CameraView enableTorch={recorderState.metering !== undefined && recorderState.metering > gating} /><View style={{ backgroundColor: BackgroundC, flex: 1 }}>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <Button title={recorderState.isRecording ? 'Stop Recording' : 'Start Recording'}
          onPress={recorderState.isRecording ? stopRecording : record} />

        <Text> {recorderState.metering} </Text>
        {/* Näyttää tähtiä metering-arvon mukaan. Out of scope jne.... */}
        {recorderState.metering !== undefined && recorderState.metering > gating - 15 ? <Text>★</Text> : null}
        {recorderState.metering !== undefined && recorderState.metering > gating ? <Text>★</Text> : null}
        {recorderState.metering !== undefined && recorderState.metering > gating + 12 ? <Text>★</Text> : null}
        <StatusBar style="auto" />
      </View>
      <TheDogPicture/>
    </View></>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,    
    alignItems: 'center'   
  },
});

