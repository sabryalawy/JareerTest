import { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";

const Table = (props) => {
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([
        { dataField: 'city', text: 'City'},
        { dataField: 'storename', text: 'Store Name' },
        { dataField: 'productname', text: 'Product Name' },
        { dataField: 'createdon', text: 'Created on' },
        { dataField: 'count', text: 'Quantity' }
    ]);
    useEffect(() => {
        console.log(props.tableData);
        setRowData(props.tableData);
    }, [props]);

    if (rowData===[]||!rowData) {
        return <h1 className="mx-5 text-center" >please Inter a filter</h1>
    }

    return (
        <div className='mb-5 mx-5'>
            <BootstrapTable keyField="storename" data={rowData} columns={columnDefs}/>
    </div>
    );
}

export default Table;