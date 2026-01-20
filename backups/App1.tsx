import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { use, useEffect } from 'react';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';

export default function App() {
    const audioRecorder = useAudioRecorder({...RecordingPresets.HIGH_QUALITY,
      isMeteringEnabled: true,});
    const recorderState = useAudioRecorderState(audioRecorder);
    const gating = -20; // dB
   
    
  
    const record = async () => {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      console.log(recorderState);
    };
  
    const stopRecording = async () => {
      // The recording will be available on `audioRecorder.uri`.
      await audioRecorder.stop();
    };
  
    useEffect(() => {
      (async () => {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission to access microphone was denied');
        }
  
        setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      })();
    }, []);


    

    //useEffect(() => {
    //  const interval = setInterval(() => {
    //    console.log('Metering:', recorderState.metering);
    //  }, 100); // Poll every 100ms (adjust as needed)
    //
    //  return () => clearInterval(interval); // Cleanup on unmount
    //}, [recorderState]);


  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title={recorderState.isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={recorderState.isRecording ? stopRecording : record} />
      <Text>-------</Text>
      <Text> {recorderState.metering} </Text>
      {recorderState.metering !== undefined && recorderState.metering > gating ? <Text>★</Text> : null}


      <Text> </Text>
      <StatusBar style="auto" />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 50,
    marginBottom: 50,
    marginTop: 50
   

    
  },
});

