import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Chart from "./component/chart";
import { useEffect, useState } from 'react';
import Axios from "axios";


function App() {
  const [datac, setDatac] = useState(null);
  const [labels, setLabels] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [unique, setUnique] = useState([]);
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

  useEffect(() => {
    var alllabels = [];

    getData().then(() => {
     
      // ---------- for labels (names branch recipts)
      for (let index = 0; index < receipts.length; index++) {
        alllabels.push(receipts[index].branch.city);
      }
      setLabels(alllabels);

      // -------- for sum recipte
      var t=0;
      var sumData = [];
      receipts.map(e=>{
        sumData[t]=parseFloat(0);
        console.log(e);
        e.items.map(i=>sumData[t]=sumData[t]+parseFloat(i.price));
        t++;
      });
      
      // --------- unique goods
      // --------- assuming that more than 20 unit sold is a unique item
      var init=0;
      var numUnique=[];
      receipts.map(e=>{
        numUnique[init]=0;
        e.items.map(i=>{
          if (i.count>20) {
            numUnique[init]=numUnique[init]+1;
          }
        });
        init++;
      })
      setUnique(numUnique);      
      
      //------- fill up data
      setDatac([
        {
          label: 'sum of every receipte',
          data:sumData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderWidth: 3
        },{
          label: 'Unique Items',
          data:numUnique,
          backgroundColor: 'rgba(0, 99, 132, 0.6)',
          borderWidth: 3
        }
      ]);


      //------ make sure that data loaded
      if (labels===null||labels===[]||setDatac.data===[]||setDatac.data===null||unique===[]||unique===null||unique===undefined) {
        setCheckdata(true);
      }
    
    });

  }, [chechdata])

  // --------------filter date
  const handelFilterDate=(start,end)=>{
    var arr=[...receipts];
    var rez=[];
    var sdate=new Date(start);
    var edate=new Date(end);
    console.log(sdate<edate);
    rez=arr.filter(e=>new Date(e.createdOn)>=new Date(start)&&new Date(e.createdOn)<=new Date(end));

    var t=0;
    var sumData = [];
    rez.map(e=>{
      sumData[t]=parseFloat(0);
      console.log(e);
      e.items.map(i=>sumData[t]=sumData[t]+parseFloat(i.price));
      t++;
    });
    var newTable=[];
    setDatac([
      {
        label: 'sum of every receipte',
        data:sumData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderWidth: 3
      }

      
    ]);
    var alllabels = [];

    for (let index = 0; index < rez.length; index++) {
      alllabels.push(rez[index].branch.city);
    }
    setLabels(alllabels);

  }

  if (!datac || !labels || !receipts) {
    return <h1>please wait</h1>
  }

  return (
    <div className="App">
      <nav className="p-3 mb-5 bg-primary text-white">
        <h1 className="center ">Sawa</h1>
      </nav>

      <Chart datas={datac} labels={labels} graphTitel="Over View On Receipts" handelFilterDate={handelFilterDate}/>


    </div>
  );
}

export default App;
