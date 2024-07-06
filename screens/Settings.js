import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Title, Subheading, Button } from 'react-native-paper'
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
    const [user, setUser] = useState({})
    const auth = getAuth()
    useEffect(()=>{
        const currentUser = auth.currentUser;
        if(currentUser){
            setUser({
                displayName : currentUser.displayName,
                email : currentUser.email,
            })
        }
    },[])
    const navigation = useNavigation()

    const signOutHandle = async () => {
        try {
            await signOut(auth)
        }catch(error){
            console.error('Sign out error :', error)
        }
    }

  return (
    <View style={{alignItems : 'center', marginTop : 16}}>
        <Avatar.Text label={user?.displayName ? user.displayName.split(" ").reduce((prev, current) => prev + current[0], "") : "UN"} />
        <Title>{user.displayName}</Title>
        <Subheading>{user.email}</Subheading>
        <Button
            onPress={signOutHandle}
        >Sign out</Button>
    </View>
  )
}

const styles = StyleSheet.create({})