import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  useAudioRecorderState
} from 'expo-audio';
import { CameraView } from 'expo-camera'

export default function App() {

    const [BackroundC, setBackgroundC] = useState<string>('#fff');
    // useAudiorecorder hookki asettaa mikin tilan, ja käynnistää db-mittarin
    const audioRecorder = useAudioRecorder({...RecordingPresets.HIGH_QUALITY,
      isMeteringEnabled: true  
    });
    // useAudioRecorderState hookki hakee mikin tilan
    const recorderState = useAudioRecorderState(audioRecorder, 50);
    const gating = -15; // dB

    // record-funktio käynnistää äänityksen
    const record = async () => {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      console.log(recorderState); //REAGOI LIIAN hitaasti. Await syynä? Tutki.
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

    // kännykän näytön backroundin värityksen vaihto biitin mukaan
    const BackgroundColor = () => {
      const hexArray = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f'
      ];
      const a = Math.floor(Math.random() * 16);
      const b = Math.floor(Math.random() * 16);
      const color = '#' + 'f' + hexArray[a] + hexArray[b];
      return setBackgroundC(color);
    };
    useEffect(() => {
      if (recorderState.metering !== undefined && recorderState.metering > gating) {
        BackgroundColor();
      }
    }, [recorderState.metering]);

  


  return (
    <View style={{...styles.container, backgroundColor: BackroundC}}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title={recorderState.isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={recorderState.isRecording ? stopRecording : record} />
      <Text>-------</Text>
      <Text> {recorderState.metering} </Text>
      {recorderState.metering !== undefined && recorderState.metering > gating ? <Text>★</Text> : null}
      <CameraView enableTorch={recorderState.metering !== undefined && recorderState.metering > gating ? true : false} />
      
      <StatusBar style="auto" />      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center', 
   

    
  },
});

