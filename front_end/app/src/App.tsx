import React, { useState, useEffect} from 'react';
import './App.css';
import './bootstrap/css/bootstrap.css';
import Welcome from './files/Welcome';
import Card from './files/Card';

const App: React.FC = () => {
  const [isLogged, setLogStatus] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showWelcome, setWelcome] = useState(false);
  const [showProfil, setViewProfil] = useState(true);
  const [showFriendList, setFriendList] = useState(false);
  const [showPendingList, setPendingList] = useState(false);
  const [showBloquedList, setBloquedList] = useState(false);
  const [showHistoryMatch, setHistoryMatch] = useState(false);
  const [showMenu, setMenu] = useState(true);

  const acceptConnection = (): void => {
    setLogStatus(true);
  };

  const openLoginWindow = (): void => {
    setShowOverlay(true);
    const newWindow = window.open('', '_blank', 'width=400,height=200');

    if (newWindow) {
      newWindow.addEventListener('beforeunload', () => {
        alert('Fenêtre fermée');
        setShowOverlay(false);
      });
    }
  };

  const openProfil = (): void => {
    setMenu(true);
    setWelcome(false);
    setViewProfil(true);
    setFriendList(false);
    setPendingList(false);
    setBloquedList(false);
    setHistoryMatch(false);
  };

  const openFriendsList = (): void => {
    setViewProfil(false);
    setFriendList(true);
    setPendingList(false);
    setBloquedList(false);
    setHistoryMatch(false);
  };

  const openPendingList = (): void => {
    setViewProfil(false);
    setFriendList(false);
    setPendingList(true);
    setBloquedList(false);
    setHistoryMatch(false);
  };

  const openBloquedPlayer = (): void => {
    setViewProfil(false);
    setFriendList(false);
    setPendingList(false);
    setBloquedList(true);
    setHistoryMatch(false);
  };

  const openMatchHistory = (): void => {
    setViewProfil(false);
    setFriendList(false);
    setPendingList(false);
    setBloquedList(false);
    setHistoryMatch(true);
  };

  const openHome = (): void => {
    setWelcome(true);
    setViewProfil(false);
    setFriendList(false);
    setPendingList(false);
    setBloquedList(false);
    setHistoryMatch(false);
    setMenu(false);
  };

  const logout = (): void => {
    alert("add here question <did you want to disconnected ?>");
    setLogStatus(false);
    setWelcome(true);
    setViewProfil(false);
    setFriendList(false);
    setPendingList(false);
    setBloquedList(false);
    setHistoryMatch(false);
    setMenu(false);
    alert("You are now disconnected !");
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent): void => {
      if (event.data === "OK")
        setLogStatus(true);
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="App">
      <div className="header">
        {isLogged && !showProfil && (
          <button className="btn btn-light" onClick={openProfil}>
            Profile
            <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </button>
        )}
        {showProfil && (
          <>
            <button className="btn btn-light">Invit to game</button>
            <button className="btn btn-light">edit profil</button>
            <button className="btn btn-light" onClick={openHome}>home</button>
            <button className="btn btn-light" onClick={logout}>Logout</button>
          </>
        )}
      </div>
      {showOverlay && <div className="overlay"></div>}

      {showWelcome && (
        <Welcome isLogged={isLogged} openLoginWindow={openLoginWindow} acceptConnection={acceptConnection} />
      )}

      {showMenu && (
        <div className="menu">
          <div className="btn-group-vertical w-100" role="group" aria-label="Vertical radio toggle button group">
            <input type="radio" className="btn-check " name="vbtn-radio" id="vbtn-radio1" autoComplete="off" onClick={openProfil} defaultChecked />
            <label className="btn btn-outline-primary fs-1 text-start" htmlFor="vbtn-radio1">Profile</label>

            <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" autoComplete="off" onClick={openFriendsList} />
            <label className="btn btn-outline-primary fs-1 text-start">Friend list</label>

            <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" autoComplete="off" onClick={openFriendsList} />
            <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio3">all friends</label>
            <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio4" autoComplete="off" onClick={openPendingList} />
            <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio4">pending invitations[6]</label>
            <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio5" autoComplete="off" onClick={openBloquedPlayer} />
            <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio5">bloqued users</label>

            <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio6" autoComplete="off" onClick={openMatchHistory} />
            <label className="btn btn-outline-primary fs-1 text-start" htmlFor="vbtn-radio6">match history</label>
          </div>
        </div>
      )}

      {showProfil && (
        <div className='content'>
          <div className='center'>
            <div className="profile-picture">
              <img src={require('./asset/default.jpg')} alt="test" className="profile-image"/>
            </div>
          </div>
          <div className='information'>
            <div className='fs-2'>
              Current nickname <br/><br/>
              Real Name <br/><br/>
              En mathématiques, on définit une notion à partir de notions antérieurement définies.<br/>
              Les notions de bases étant les symboles non logiques du langage considéré, dont l'usage est défini par les axiomes de la théorie.<br/>
              Se pose la question de la différence entre une définition et un axiome.<br/>
              Pour exemple, dans l'arithmétique de Peano, l'addition et la multiplication sont des symboles du langage et leur fonctionnement est régi par des axiomes.<br/>
              Mais on pourrait tout à fait réduire le langage de l arithmétique en supprimant les symboles « + » et « * » et les définir à partir de 0 et de la fonction successeur d'une manière similaire.<br/>
              Cela nous donnerait une autre théorie arithmétique, mais essentiellement équivalente sur toutes ses propriétés élémentaires. 
            </div>
          </div>
        </div>
      )}
      
      {showFriendList && (
        <div className="content">
          <div className="printCard">
            <Card photo={'./as.jsset/default.jpg'} text={'test1'}/>
            <Card photo={'./asset/default.jpg'} text={'test2'}/>
            <Card photo={'./asset/default.jpg'} text={'test3'}/>
            <Card photo={'./asset/default.jpg'} text={'test4'}/>
          </div>
        </div>
      )}

      {showPendingList && (
        <div className="content">
          <button className="btn btn-light">demande d ami</button>
        </div>
      )}

      {showBloquedList && (
        <div className="content">
          <button className="btn btn-light">show Bloqued Player</button>
        </div>
      )}

      {showHistoryMatch && (
        <div className="content">
          <button className="btn btn-light">show history match</button>
        </div>
      )}
    </div>
  );
};

export default App;