import React, { useState } from 'react';
import './App.css';
import './bootstrap/css/bootstrap.css'

const App = () => {
  const [isLogged, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!isLogged);
  };

  return (
    <div className="App">
      <header>
        {isLogged && (
          <div className="login" align="right"> 
            <button> test </button>
          </div>
        )}
      </header>
      <div class="login-choice">
        <h1 class="display-1">Welcome</h1>
        <div class="container row ">
          <div class="row">
            <div class="col-md-4 text-right ">
              <button class="btn btn-primary" onClick={toggleProfile}> Login </button>
            </div>
            <div class="col-md-4 text-center">
              <button class="btn btn-primary" onClick={toggleProfile}> Guest </button>
            </div>
            <div class="col-md-4 text-left">
              <button class="btn btn-primary"> Leaderboard </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
