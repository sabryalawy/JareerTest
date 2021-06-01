import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Chart from "./component/chart";
import { useEffect, useState } from 'react';
import Axios from "axios";


function App() {
  // ---------- Receipts
  const [receipts, setReceipts] = useState([]);
  const [datac, setDatac] = useState(null);
  const [labels, setLabels] = useState(null);
  const [unique, setUnique] = useState(null);
  const [chechdata, setCheckdata] = useState(false);

  // ----------- category
  const [lableCat, setLabelCat] = useState(null);
  const [dataCat, setDataCat] = useState(null);

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

  //how many did evrey category sales on a period if time
  const categorySalesOnperiodOfTime=(start,end)=>{
    var arr = [...receipts];
    var rez = [];
    var sdate = new Date(start);
    var edate = new Date(end);
    rez = arr.filter(e => new Date(e.createdOn) >= new Date(start) && new Date(e.createdOn) <= new Date(end));
    if (rez===[]) {
      console.log("yes");
    }
    setDataCat(        [
      {
        label: 'sum of every category ',
        data: sumForEachCat(rez),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderWidth: 3
      }
    ]
  );
    setLabelCat(getLabelCat(rez))

  }


  //for labels (catigories)
  const getLabelCat = (arr) => {
    
    var o = 0;
    var rez = [];
    if (arr.length)
      arr.map(e => {
        e.items.map(i => {
          if (!rez.find(e => e === i.category)) {
            rez.push(i.category)
          }
          o++;
        });
      });
    return rez
  }

  //sum for each catigory
  const sumForEachCat = (arr) => {
    var init = 0;
    var rez = Array(12);
    for (let index = 0; index < rez.length; index++) {
      rez[index] = init;

    }

    if (lableCat && lableCat.indexOf("Meat") !== -1 && arr.length) {

      arr.map(e => {
        e.items.map(i => {
          rez[lableCat.indexOf(i.category)] = rez[lableCat.indexOf(i.category)] + i.count;
        })
      })

    }
    return rez;
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

      // -------- lable cats
      setLabelCat(getLabelCat(receipts));

      //------- fill up data receipts
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

      //---------- fill up data catigory
      setDataCat(
        [
          {
            label: 'sum of every category ',
            data: sumForEachCat(receipts),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderWidth: 3
          }
        ]
      );
      //------ make sure that data loaded
      if ((!datac || !labels || (!unique || unique.length === 0) || !lableCat ||!lableCat.length ||!dataCat||!dataCat.length)) {
        if (chechdata) {
          setCheckdata(false);

        } else
          setCheckdata(true);
      }

    });
  }, [chechdata])

  // --------------filter date receipts
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

  if (!datac || !labels || !receipts || !unique||!dataCat||!lableCat) {
    return <h1>please wait</h1>
  }

  return (
    <div className="App">
      <nav className="p-3 mb-5 bg-primary text-white">
        <h1 className="center ">Sawa</h1>
      </nav>

      <Chart  datas={datac} labels={labels} graphTitel="Over View On Receipts" handelFilterDate={handelFilterDate} totaltitle="Total Price Of All Recepts"/>
      <Chart  datas={dataCat} labels={lableCat} graphTitel="Over View On Categories Sales" handelFilterDate={categorySalesOnperiodOfTime} totaltitle="Total Quantity Sold"/>


    </div>
  );
}

export default App;
