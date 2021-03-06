import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const Chart = (props) => {

    const [datac, setDatac] = useState();
    const [dates, setDates] = useState();
    const [datee, setDatee] = useState();
    const [total, setTotal] = useState();
    const [t1,sett1]=useState();


    useEffect(() => {
        // calculate the sum of the first set of data
        var rez = 0;
        props.datas[0].data.map(e => {
            rez += e;
        })
        setTotal(rez);

        setDatac({
            labels: props.labels,
            datasets: props.datas
        });
    }, [props]);

    const hadelOnclick = (e) => {
        console.log(e);
    }


return (

    <div className="card m-5">
        
        <div className="card-body text-center">
            <div>
                <h3>{props.graphTitel}</h3>
                <div>
                    <label >start :</label><input className="d-inline m-4" type="date" onChange={(e) => { setDates(e.target.value); props.handelFilterDate(dates, datee); }} value={dates} />
                    <label >end :</label><input className="d-inline m-3" type="date" onChange={(e) => { setDatee(e.target.value); props.handelFilterDate(dates, datee) }} value={datee} />
                    <button type="button" className="btn btn-primary" onClick={() => props.handelFilterDate(dates, datee)}>filter</button>
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
            <div className="card text-white bg-info m-3 text-left d-inline-block" >
                <div className="card-body ">
                    <h5 className="card-title">{props.totaltitle} = {new Intl.NumberFormat().format(total)}</h5>
                </div>
            </div>
        </div>

    </div>
);
}

export default Chart;