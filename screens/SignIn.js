import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { TextInput, Button, Subheading } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const auth = getAuth();

  const loginAccount = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      navigation.navigate('Main'); // Başarılı girişten sonra ana sayfaya yönlendirme
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return (
    <View style={{ margin: 16 }}>
      {!!error && (
        <Subheading style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>
          {error}
        </Subheading>
      )}
      <TextInput
        autoCapitalize='none'
        label="Email"
        style={{ marginTop: 12 }}
        keyboardType='email-address'
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        label="Password"
        style={{ marginTop: 12 }}
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <Button compact onPress={() => navigation.navigate('SignUp')}>Sign Up</Button>
        <Button mode='contained' onPress={loginAccount} loading={isLoading}>Sign In</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});