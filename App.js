import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [points, setPoints] = useState(0);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedPoints = await AsyncStorage.getItem('points');
    const savedTasks = await AsyncStorage.getItem('tasks');
    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  };

  const addPoints = async () => {
    const newPoints = points + 10;
    setPoints(newPoints);
    await AsyncStorage.setItem('points', newPoints.toString());
    Alert.alert('সাবাশ!', '+10 পয়েন্ট যোগ হইছে');
  };

  const addTask = async () => {
    if (task.trim() === '') return;
    const newTasks = [...tasks, { id: Date.now().toString(), text: task, done: false }];
    setTasks(newTasks);
    setTask('');
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Point Earn Tracker</Text>
      <Text style={styles.points}>তোমার পয়েন্ট: {points}</Text>
      
      <Button title="পয়েন্ট নাও +10" onPress={addPoints} />
      
      <TextInput
        style={styles.input}
        placeholder="টাস্ক লিখো..."
        value={task}
        onChangeText={setTask}
      />
      
      <Button title="টাস্ক যোগ করো" onPress={addTask} />
      
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskBox}>
            <Text style={styles.task}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  points: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    color: 'green',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  taskBox: {
    backgroundColor: '#fff',
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: 'green',
  },
  task: {
    fontSize: 16,
  }
});
