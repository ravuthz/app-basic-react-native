import React from 'react';
import {
  Component,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ListView
} from 'react-native';

import firebase from 'firebase';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    var firebaseRef = firebase.initializeApp({
      apiKey: "AIzaSyAsrmYvgrMHN3zE3yde438R91AAkJonrvQ",
      authDomain: "react-app-basic.firebaseapp.com",
      databaseURL: "https://react-app-basic.firebaseio.com",
      projectId: "react-app-basic",
      storageBucket: "react-app-basic.appspot.com",
      messagingSenderId: "154993519123"
    });

    firebase.database().ref('application').set({
      title: 'Hello World',
      author: 'Ravuthz',
      location: {
        zip: 12000,
        city: 'Phnom Penh',
        state: 'Phnom Penh'
      }
    });

    this.itemsRef = firebase.database().ref('items');

    this.state = {
      newTodo: '',
      todoSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };

    this.items = [];
  }

  componentDidMount() {
    // When a todo is added
    this.itemsRef.on('child_added', (snapshot) => {
      console.log("child_added snapshot: ", snapshot);
      this.items.push({id: snapshot.key, text: snapshot.val()});
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      });
    });

    // When a todo is removed
    this.itemsRef.on('child_removed', (snapshot) => {
      console.log("child_added snapshot: ", snapshot);
      this.items = this.items.filter((x) => {
        return x.id !== snapshot.key;
      });
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      });
    });
  }

  createTodo() {
    if (this.state.newTodo !== '') {
      this.itemsRef.push({todo: this.state.newTodo});
      this.setState({newTodo: ''});
    }
  }

  deleteTodo(item) {
    this.itemsRef.child(item.id).remove();
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight underlayColor='#dddddd' onPress={() => this.deleteTodo(rowData)}>
        <View>
          <View style={styles.row}>
            <Text style={styles.todoText}>{rowData.text.todo}</Text>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.appContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>
            My Todos
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} onChangeText={(text) => this.setState({newTodo: text})} value={this.state.newTodo}/>
          <TouchableHighlight style={styles.button} onPress={() => this.createTodo()} underlayColor='#dddddd'>
            <Text style={styles.btnText}>Add!</Text>
          </TouchableHighlight>
        </View>
        <ListView dataSource={this.state.todoSource} renderRow={this.renderRow.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1
  },
  titleView: {
    backgroundColor: '#48afdb',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  titleText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20
  },
  inputContainer: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    height: 36,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    borderRadius: 4
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6
  },
  input: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48afdb',
    borderRadius: 4,
    color: '#48BBEC'
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    height: 44
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC'
  },
  todoText: {
    flex: 1
  }
});
