import { StyleSheet, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { List, Avatar, Divider, FAB, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { collection, addDoc, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function ChatList() {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [auth]);

  const createChat = async () => {
    try {
      if (!email || !userEmail) {
        return;
      }
      setIsLoading(true);
      const res = await addDoc(collection(db, 'chats'), {
        users: [email, userEmail]
      });
      setIsLoading(false);
      setIsDialogVisible(false);
      navigation.navigate('Chat', { chatId: res.id });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  useEffect(() => {
    if (!email) return;

    const q = query(collection(db, 'chats'), where('users', 'array-contains', email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        const chatId = doc.id;
        const chatData = doc.data();
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));

        onSnapshot(messagesQuery, (messagesSnapshot) => {
          const lastMessageData = messagesSnapshot.docs[0]?.data();
          const lastMessage = lastMessageData ? {
            text: lastMessageData.text,
            createdAt: lastMessageData.createdAt ? lastMessageData.createdAt.toDate() : new Date(),
          } : {
            text: 'No messages yet',
            createdAt: new Date(0),
          };

          setChats((prevChats) => {
            const updatedChats = prevChats.filter((chat) => chat.id !== chatId);
            updatedChats.push({
              id: chatId,
              ...chatData,
              lastMessage
            });
            return updatedChats.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt); // Sort chats by latest message date
          });
        });
      });
    }, (error) => {
      console.error('Error fetching documents: ', error);
    });

    return () => unsubscribe();
  }, [email]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{}}
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <List.Item
              style={{ flex: 1, paddingLeft: 20 }}
              title={email !== item.users[0] ? item.users[0] : item.users[1]}
              description={item.lastMessage.text}
              left={() => <Avatar.Text label={item.users.map(user => user[0]).join('')} size={56} />}
              onPress={() => navigation.navigate('Chat', { chatId: item.id })}
            />
            <Divider horizontalInset />
          </>
        )}
      />

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Enter user email"
              autoCapitalize='none'
              value={userEmail}
              onChangeText={(text) => setUserEmail(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={createChat} loading={isLoading}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB
        icon='plus'
        style={{ position: 'absolute', bottom: 16, right: 16 }}
        onPress={() => setIsDialogVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({});