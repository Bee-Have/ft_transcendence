import React from 'react';

interface MenuProps {
  updateBooleanStates: (statesToUpdate: Record<string, boolean>) => void;
}

const Menu: React.FC<MenuProps> = ({ updateBooleanStates }) => {
  return (
    <div className="menu">
      <div className="btn-group-vertical w-100" role="group" aria-label="Vertical radio toggle button group">
        <input type="radio" className="btn-check " name="vbtn-radio" id="vbtn-radio1" autoComplete="off" onClick={() => updateBooleanStates({ showProfil: true, showMenu: true })} defaultChecked />
        <label className="btn btn-outline-primary fs-1 text-start" htmlFor="vbtn-radio1">Profile</label>

        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" autoComplete="off" onClick={() => updateBooleanStates({ showFriendList: true, showMenu: true })}/>
        <label className="btn btn-outline-primary fs-1 text-start">Friend list</label>

        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" autoComplete="off" onClick={() => updateBooleanStates({ showFriendList: true, showMenu: true })} />
        <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio3">all friends</label>
        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio4" autoComplete="off" onClick={() => updateBooleanStates({ showPendingList: true, showMenu: true })}/>
        <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio4">pending invitations</label>
        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio5" autoComplete="off" onClick={() => updateBooleanStates({ showBloquedList: true, showMenu: true })} />
        <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio5">bloqued users</label>

        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio6" autoComplete="off" onClick={() => updateBooleanStates({ showHistoryMatch: true, showMenu: true })} />
        <label className="btn btn-outline-primary fs-1 text-start" htmlFor="vbtn-radio6">match history</label>
    	</div>
  	</div>
  );
};

export default Menu;