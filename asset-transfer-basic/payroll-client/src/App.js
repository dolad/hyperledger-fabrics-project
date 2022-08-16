import logo from './logo.svg';
import './App.css';
import DashBoard from './dashboard';
import Forms  from  './components/Forms/Input'
import { useState } from 'react';

function App() {
  const [numofData, setNumberofData] = useState(50);
  return (
    <div className="App">
        <div className='container p-5'>
            <h2 className='p-5'> Payroll TestData for OrgB</h2>
            <Forms setNumberofData={setNumberofData} />
            <DashBoard numberOfData = {numofData} />
        </div>
    </div>
  );
}

export default App;
