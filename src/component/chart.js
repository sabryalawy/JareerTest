import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const Chart = (props) => {

    const [datac, setDatac] = useState();


    useEffect(() => {

        setDatac({
            labels: props.labels,
            datasets: props.datas
        });
    }, [props.labels,props.datas]);

    const hadelOnclick=(e)=>{
        console.log(e);
    }

    const handelFilter=()=>{
        props.handelFilterDate(document.getElementById("date1").value,document.getElementById("date1").value);
    }  

    return (
        <div className="card m-5">

            <div className="card-body">
                <div>
                    <h3>{props.graphTitel}</h3>
                    <div>
                    <input className="d-inline" type="date" id="date1"/>
                    <input className="d-inline m-3" type="date" id="date2"/>
                    <button type="button" className="btn btn-primary" onClick={()=>props.handelFilterDate(document.getElementById("date1").value,document.getElementById("date2").value)}>filter</button>
                    </div>
                </div>
                <Line
                    data={datac}
                    width={600}
                    height={200}
                    options={{layout:0},
                    {onClick:(e)=>hadelOnclick(e)}
                    }

                />
            </div>

        </div>
    );
}

export default Chart;