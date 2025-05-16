import './CSS/App.css';
import stocks from './data.js';
import Table from './components/Table.js';
import Chart from './components/Chart.js';
import { useState } from 'react';

function App() {
  const [filteredData, setFilteredData] = useState(stocks);

  return (
    <div className="App">
      <h3 className='title'>Акции российских компаний</h3>
      <Chart data={filteredData} />
      <Table 
        data={stocks} 
        amountRows="15" 
        onFilter={setFilteredData}
      />
    </div>
  );
}

export default App;