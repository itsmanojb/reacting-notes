import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Home from './components/pages/Home';
import About from './components/pages/About';

class App extends Component {

  render() {
    return (
      <div className="app">
        <Route path="/" exact component={Home} />
        <Route path="/about" exact component={About} />
      </div>
    );
  }

}

export default App;
