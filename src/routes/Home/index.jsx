import React from 'react';
import Counter from '../../components/counter';
import './style.scss';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>La İlahe İllallah</h1>
        <br />
        <Counter />
      </div>
    </div>
  );
}

export default Home;