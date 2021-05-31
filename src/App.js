import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Chart from "./component/chart";
import { useEffect, useState } from 'react';
import Axios from "axios";


function App() {
  const [datac, setDatac] = useState(null);
  const [labels, setLabels] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [unique, setUnique] = useState(null);
  const [chechdata, setCheckdata] = useState(false);

  // get data from github 
  const getData = async () => {
    var receipt = [];
    await Axios.get("https://gist.githubusercontent.com/ahmadseder/632818e21335a20e9cd9957e2dfe849a/raw/ec32d88512f1861ece13de616376a92d2e1c8d3f/task%2520data").then(
      (rez) => {
        receipt = JSON.stringify(rez.data);
        receipt = JSON.parse(receipt);
        setReceipts(receipt);
      }
    )
  }

  // ---------- for labels (names branch recipts)
  //--- note arr has to be the same structure as receipts
  const forTables = (arr) => {
    var alllabels = [];
    for (let index = 0; index < arr.length; index++) {
      alllabels.push(arr[index].branch.city);
    }
    return alllabels;
  }

  //  -------- const makeSum
  const makeSum = (arr) => {
    var t = 0;
    var sumData = [];
    arr.map(e => {
      sumData[t] = parseFloat(0);
      e.items.map(i => sumData[t] = sumData[t] + parseFloat(i.price));
      t++;
    });
    return sumData;
  }

  //------- get num of unique in arr
  const getNumUnique = (arr) => {
    var init = 0;
    var numUnique = [];
    arr.map(e => {
      numUnique[init] = 0;
      e.items.map(i => {
        if (i.count > 20) {
          numUnique[init] = numUnique[init] + 1;
        }
      });
      init++;
    })
    return numUnique;
  }


  useEffect(() => {
    getData().then(() => {
      // ---------- for labels (names branch recipts)
      setLabels(forTables(receipts));

      // --------- unique goods
      // --------- assuming that more than 20 unit sold is a unique item
      setUnique(getNumUnique(receipts));

      //------- fill up data
      setDatac([
        {
          label: 'sum of every receipte',
          data: makeSum(receipts),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderWidth: 3
        }, {
          label: 'Unique Items',
          data: unique,
          backgroundColor: 'rgba(0, 99, 132, 0.6)',
          borderWidth: 3
        }
      ]);
      //------ make sure that data loaded

      if ((!datac || !labels || (!unique || unique.length === 0))) {
        if (chechdata) {
          setCheckdata(false);

        } else
          setCheckdata(true);
      }

    });
  }, [chechdata])

  // --------------filter date
  const handelFilterDate = (start, end) => {
    var arr = [...receipts];
    var rez = [];
    var sdate = new Date(start);
    var edate = new Date(end);
    rez = arr.filter(e => new Date(e.createdOn) >= new Date(start) && new Date(e.createdOn) <= new Date(end));
    
    setLabels(forTables(rez));
    setUnique(getNumUnique(rez));
    setDatac([
      {
        label: 'sum of every receipte',
        data: makeSum(rez),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderWidth: 3
      }, {
        label: 'Unique Items',
        data: unique,
        backgroundColor: 'rgba(0, 99, 132, 0.6)',
        borderWidth: 3
      }
    ]);
  }

  if (!datac || !labels || !receipts || !unique) {
    return <h1>please wait</h1>
  }

  return (
    <div className="App">
      <nav className="p-3 mb-5 bg-primary text-white">
        <h1 className="center ">Sawa</h1>
      </nav>

      <Chart datas={datac} labels={labels} graphTitel="Over View On Receipts" handelFilterDate={handelFilterDate} />


    </div>
  );
}

export default App;
