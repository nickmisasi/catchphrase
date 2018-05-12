import React from 'react';
import { Button, Vibration } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import Hamburger from 'react-native-hamburger';
import movies from './words/words.json';
import {Row, Grid, Col} from 'react-native-easy-grid';
import timer from 'react-native-timer';
import 'babel-polyfill';

async function randomWord(){
  let response = await fetch('http://api.urbandictionary.com/v0/random', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(responseJson => {
    return responseJson;
  }).catch(error => {throw error});
  if (response){
    return response.list;
  }else{
    return movies[Math.floor((Math.random() * movies.length) +1)];
  }
  
}

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      message: "Press Me",
      started: false,
      words: [],
      word: "",
      category: "Urban Dict",
      definition: "",
      currWordIndex: 0,
      currTeam: false,
      team1: 0,
      team2: 0,
    };
    this.handleStartButtonPress = this.handleStartButtonPress.bind(this);
    this.handleSkipButtonPress = this.handleSkipButtonPress.bind(this);
    this.handleCorrectButtonPress = this.handleCorrectButtonPress.bind(this);
    this.handleTeamInfo = this.handleTeamInfo.bind(this);
    this.handleTimeElapsed = this.handleTimeElapsed.bind(this);
  }

  async handleStartButtonPress(){
    const newWordObject = await randomWord();
    this.setState({
      started: true,
      words: newWordObject,
      word: newWordObject[this.state.currWordIndex].word,
      definition: newWordObject[this.state.currWordIndex].definition,
      currWordIndex: this.state.currWordIndex += 1,
    }, () => timer.setTimeout(this, 'elapsedTime', () => this.handleTimeElapsed(), 90000));
  }

  async handleNextWord(){
    console.log("handleNextWord");
    if(this.state.currWordIndex > 9){
      const newWordObject = await randomWord();
      this.setState({
        words: newWordObject,
        word: newWordObject[0].word,
        currWordIndex: 1,
      });
    }
    else{
      this.setState({
        word: this.state.words[this.state.currWordIndex].word,
        definition: this.state.words[this.state.currWordIndex].definition,
        currWordIndex: this.state.currWordIndex += 1,
      });
    }
  }

  handleTeamInfo(mode){
    this.setState({
      currTeam: !this.state.currTeam,
    });
  }

  async handleSkipButtonPress(){
    this.handleNextWord();
  }

  handleCorrectButtonPress(){
    this.handleNextWord();
    this.handleTeamInfo("correct");
  }
  
  handleTimeElapsed(){
    console.log("TIME ELAPSED");
    Vibration.vibrate(2500);
    switch(this.state.currTeam){
      case false:
        this.setState({
          team2: this.state.team2 += 1,
        });
        break;
      case true:
        this.setState({
          team1: this.state.team1 += 1,
        });
        break;
    }
    this.setState({
      started: false,
    });
  }

  render() {
    style ={
      fontSize: 64,
    }
    return (
      <Grid>
        <View style={styles.container}>
          <Row size={0.5}>
            <View style={{marginTop: 50, flexDirection: 'row'}}>
              <Col>
                <Text style={{float: 'right'}}>Team 1: {this.state.team1}</Text>
              </Col>
              <Col style={{width: '50%'}}>
                <Text style={{float: 'right'}}> Team 2: {this.state.team2}</Text>
              </Col>  

            </View>
          </Row>
          <Row size={1}>
          <View>
            <Text style={{fontSize: 24, marginTop: 90}}>Category: {this.state.category}</Text>
          </View>
          </Row>
          <Row size={2}>
          <View>
          {
            this.state.started &&
              <Text style={style}>
              {this.state.word}
              </Text>
          }
          </View>
          </Row>
          <Row size={1}>
          <View marginBottom={0}>
          {
            !this.state.started &&
            <Button
              onPress={this.handleStartButtonPress}
              title="Start"
              color="#841584"
              accessibilityLabel="Press this button to start"
            />
          }
          {
            this.state.started &&
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View style={{marginRight: 100, width: 50}}>
              <Button
                onPress={this.handleSkipButtonPress}
                title="Skip"
                color="#841584"
                accessibilityLabel="Skip word"
              />
            </View>
            <View>
              <Button
                onPress={this.handleCorrectButtonPress}
                title="Correct"
                color="#841584"
                accessibilityLabel="Word guessed correctly"
              />
              </View>
            </View>
          }
          </View>
        </Row>
      </View>
    </Grid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
