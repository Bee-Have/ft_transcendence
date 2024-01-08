import React from 'react';

import Menu from '../../components/menu';

const Channel = ({ photo, text }: any) => {
  return (
    <div className="card">
		
    </div>
  );
};


const Channels: React.FC = () => {
  return (
    <div className="pending">
      <Menu/>
      <div className="content">
        <div className="printCard">
          <Channel photo={'http://localhost:3001/user/image/94555'} text={'test1'} />
          <Channel photo={'http://localhost:3001/user/image/94555'} text={'test2'} />
          <Channel photo={'http://localhost:3001/user/image/94555'} text={'test3'} />
          <Channel photo={'http://localhost:3001/user/image/94555'} text={'test4'} />
        </div>
      </div>
    </div>
  );
};

export default Channels;