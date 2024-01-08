import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuProps {
  checker: number;
}

const Menu: React.FC<MenuProps> = ({checker}) => {
  const navigate = useNavigate();

  const isDefaultChecked = (num: number) => num === checker;

  return (
    <div className="menu">
      <div className="btn-group-vertical w-100" role="group" aria-label="Vertical radio toggle button group">
        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio1" autoComplete="off" onClick={() => navigate("/profil")} defaultChecked={isDefaultChecked(1)}/>
        <label className="btn btn-outline-primary fs-1 text-start" htmlFor="vbtn-radio1">Profile</label>

        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" autoComplete="off" onClick={() => navigate("/profil/friend-list")}/>
        <label className="btn btn-outline-primary fs-1 text-start" htmlFor="vbtn-radio3">Friend list</label>

        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" autoComplete="off" onClick={() => navigate("/profil/friend-list")} defaultChecked={isDefaultChecked(2)} />
        <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio3">all friends</label>

        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio4" autoComplete="off" onClick={() => navigate("/profil/pending-friend-request")} defaultChecked={isDefaultChecked(3)} />
        <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio4">pending invitations</label>

        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio5" autoComplete="off" onClick={() => navigate("/profil/blocked")} defaultChecked={isDefaultChecked(4)} />
        <label className="btn btn-outline-primary fs-6" htmlFor="vbtn-radio5">blocked users</label>

        <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio6" autoComplete="off" onClick={() => navigate("/profil/match-history")} defaultChecked={isDefaultChecked(5)} />
        <label className="btn btn-outline-primary fs-1 text-start" htmlFor="vbtn-radio6">match history</label>
      </div>
    </div>
  );
};

export default Menu;