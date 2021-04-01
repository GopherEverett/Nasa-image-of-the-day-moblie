import { StatusBar } from 'expo-status-bar';
import React, { Fragment, useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Linking,
  Image,
  TouchableHighlight,
  Modal,
  Alert,
  Pressable,
  RefreshControl
} from 'react-native';
import { WebView } from 'react-native-webview'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import axios from 'axios'

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function App(props) {
  const [astronomy, setAstronomy] = useState({ "title": "title" });
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const END_POINT = 'https://api.nasa.gov/planetary/apod?api_key=cJNsCTUe5qljyX5KsERSkzK5GXyJOWApJVpNI5fL';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    axios.get(END_POINT).then(res => {
      setAstronomy(res.data)
    })
  }, [])

  return (
    <Fragment>
      <StatusBar />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.mainTitleContainer}>
          <Text style={styles.mainTitle}>NASA Image of the Day</Text>
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >

          <View style={styles.body}>
            <View style={styles.centeredView}>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Herro!</Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Hide Me</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.textStyle}>Press Me</Text>
              </Pressable>
            </View>
            <View style={styles.sectionContainer}>
              <View>
                <Text style={styles.sectionTitle}>
                  {astronomy.title}
                </Text>
              </View>
              {astronomy.media_type === 'image' ?
                <View style={styles.imageContainer}>
                  <Text style={styles.sectionTitleParens}>(click image for HD version)</Text>
                  <TouchableHighlight onPress={() => Linking.openURL(astronomy.hdurl)}>
                    <Image
                      style={styles.imageStyle}
                      source={{ uri: astronomy.hdurl }}
                    />
                  </TouchableHighlight>
                </View> :
                <View style={styles.videoContainer}>
                  <WebView
                    scalesPageToFit={true}
                    bounces={false}
                    javaScriptEnabled
                    style={styles.videoView}
                    source={{
                      html: `<iframe width='100%' height='100%' src=${astronomy.url} title='Embedded youtube'/>`,
                    }}
                  />
                </View>
              }
              <Text style={styles.sectionDescription}>
                {astronomy.explanation}
              </Text>
              <Text style={styles.copyDate}>
                {astronomy.date}{' '}
                {astronomy.copyright}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: 'gray'
  },
  scrollView: {
    backgroundColor: '#525151',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: '#3b3b3b',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Futura',
  },
  sectionTitleParens: {
    fontSize: 20,
    fontWeight: '500',
    color: '#c8ebf7',
    textAlign: 'center',
  },
  videoView: {
    // height: 200,
    // width: 300,
  },
  videoContainer: {
    height: 200,
    width: '100%'
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Futura',
    textShadowColor: '#c8ebf7',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  mainTitleContainer: {
    backgroundColor: 'black',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
  },
  imageStyle: {
    width: 380,
    height: 300,
    borderRadius: 5,
    marginTop: 5,
  },
  copyDate: {
    color: 'white',
    textAlign: 'center',
    margin: 8,
    fontFamily: 'Futura',
  },
  highlight: {
    fontWeight: '700',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 28,
    fontWeight: "800",
    fontFamily: 'Cochin',
    marginBottom: 15,
    textAlign: "center"
  }
});
