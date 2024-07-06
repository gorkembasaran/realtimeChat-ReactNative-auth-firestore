import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Button, Subheading } from 'react-native-paper'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')
    const navigation = useNavigation();
    const auth = getAuth();

    const createAccount = async () => {
            setIsLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(res.user, { displayName: name });
            setIsLoading(false);
            navigation.popToTop();
        } catch (error) {
            setIsLoading(false);
            setError(error.message)
        }
    };

  return (
    <View style={{margin : 16}}>
        { !!error && <Subheading style={{color : 'red', textAlign: 'center', marginBottom: 16}}>
            {error}
        </Subheading>}
        <TextInput label="Name" value={name} onChangeText={text => setName(text)} />
        <TextInput autoCapitalize='none' label="Email" style={{marginTop : 12}} 
            keyboardType='email-address'
            value={email} onChangeText={text => setEmail(text)}
        />
        <TextInput label="Password" style={{marginTop : 12}}
        secureTextEntry
            value={password} onChangeText={text => setPassword(text)}
        />
        <View style={{flexDirection : 'row', justifyContent: 'space-between', marginTop : 16}}>
            <Button compact onPress={()=>navigation.navigate('SignIn')}>Sign In</Button>
            <Button mode='contained' onPress={()=>{createAccount()}} loading={isLoading}>Sign Up</Button>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})