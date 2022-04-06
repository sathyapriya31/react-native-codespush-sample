/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CodePush from 'react-native-code-push';
let codePushOptions = {checkFrequency: CodePush.CheckFrequency.MANUAL};
const App: () => React$Node = () => {
  const [restartAllowed, setRestartAllowed] = useState(true);
  const [syncMessage, setSyncMessage] = useState('');
  const [progress, setProgress] = useState(false);

  function codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        setSyncMessage('Checking for update.');
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        setSyncMessage('Downloading package.');
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        setSyncMessage('Awaiting user action.');
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        setSyncMessage('Installing update.');
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        setSyncMessage('App up to date.');
        setProgress(false);
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        setSyncMessage('Update cancelled by user.');
        setProgress(false);
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        setSyncMessage('Update installed and will be applied on restart.');
        setProgress(false);

        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        setSyncMessage('An unknown error occurred.');
        setProgress(false);
        break;
    }
  }

  function codePushDownloadDidProgress(progress) {
    setProgress(progress);
  }

  function toggleAllowRestart() {
    restartAllowed ? CodePush.disallowRestart() : CodePush.allowRestart();

    setRestartAllowed(!restartAllowed);
  }

  /** Update is downloaded silently, and applied on restart (recommended) */
  function sync() {
    CodePush.sync(
      {},
      codePushStatusDidChange.bind(this),
      codePushDownloadDidProgress.bind(this),
    );
  }

  /** Update pops a confirmation dialog, and then immediately reboots the app */
  function syncImmediate() {
    CodePush.sync(
      {installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true},
      codePushStatusDidChange.bind(this),
      codePushDownloadDidProgress.bind(this),
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <TouchableOpacity onPress={sync.bind(this)}>
              <Text style={styles.syncButton}>Press for background sync</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={syncImmediate.bind(this)}>
              <Text style={styles.syncButton}>
                Press for dialog-driven sync
              </Text>
            </TouchableOpacity>
            {progress && (
              <Text style={styles.messages}>
                {progress.receivedBytes} of {progress.totalBytes} bytes received
              </Text>
            )}
            <TouchableOpacity onPress={toggleAllowRestart.bind(this)}>
              <Text style={styles.restartToggleButton}>
                Restart {restartAllowed ? 'allowed' : 'forbidden'}
              </Text>
            </TouchableOpacity>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  messages: {
    marginTop: 30,
    textAlign: 'center',
  },
  syncButton: {
    color: 'green',
    fontSize: 17,
    margin: 10,
  },
  restartToggleButton: {
    color: 'blue',
    fontSize: 17,
    margin: 10,
  },
});

export default CodePush(codePushOptions)(App);
