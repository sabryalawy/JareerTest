import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const Chart = (props) => {

    const [datac, setDatac] = useState();
    const [dates,setDates]=useState();
    const [datee,setDatee]=useState();


    useEffect(() => {

        setDatac({
            labels: props.labels,
            datasets: props.datas
        });
    }, [props]);

    const hadelOnclick = (e) => {
        console.log(e);
    }

    const handelFilter = () => {
        console.log();
        props.handelFilterDate(document.getElementById(props.sdate).value, document.getElementById(`props.edate`).value);
    }

    return (
        <div className="card m-5">

            <div className="card-body">
                <div>
                    <h3>{props.graphTitel}</h3>
                    <div>
                        <label >start :</label><input className="d-inline m-4" type="date" onChange={(e)=>setDates(e.target.value)} value={dates} />
                        <label >end :</label><input className="d-inline m-3" type="date"  onChange={(e)=>setDatee(e.target.value)} value={datee}/>
                        <button type="button" className="btn btn-primary" onClick={() =>props.handelFilterDate(dates,datee)}>filter</button>
                    </div>
                </div>
                <Line
                    data={datac}
                    width={600}
                    height={200}
                    options={{ layout: 0 },
                        { onClick: (e) => hadelOnclick(e) }
                    }

                />
            </div>

        </div>
    );
}

export default Chart;