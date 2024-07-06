import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { collection, doc, getDoc, onSnapshot, addDoc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { GiftedChat } from 'react-native-gifted-chat';
import { getAuth } from 'firebase/auth';

export default function Chat() {
  const route = useRoute();
  const [chat, setChat] = useState(null);
  const chatId = route.params.chatId;
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const [uid, setUID] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUID(currentUser?.uid);
    setName(currentUser?.displayName);
  }, [auth]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);

        if (chatSnap.exists()) {
          setChat(chatSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (e) {
        console.error('Error fetching document: ', e);
      }
    };

    fetchChat();
  }, [chatId]);

  useEffect(() => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => {
        const firebaseData = doc.data();

        const data = {
          _id: doc.id,
          text: firebaseData.text,
          createdAt: firebaseData.createdAt ? firebaseData.createdAt.toDate() : new Date(),
          user: {
            _id: firebaseData.user._id,
            name: firebaseData.user.name,
          },
        };

        return data;
      });

      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chatId]);

  const onSend = useCallback(async (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      _id,
      createdAt: serverTimestamp(),
      text,
      user,
    });
  }, [chatId]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});