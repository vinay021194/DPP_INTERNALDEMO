
import React, { useState, useEffect, useRef } from 'react';
import classNames from "classnames";
import { DataTable } from 'primereact/datatable';
import {  useHistory } from "react-router-dom";
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar'
import { ProductService } from '../services/ProductService';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './App.css';
import { AppMenu } from "../components/AppMenu";
import { AppTopbar } from "../components/AppTopbar";
import { CSSTransition } from "react-transition-group";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Chip } from 'primereact/chip';

 export const Materialdatachart = () => {
    const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    //const toast = useRef(null);
    const isMounted = useRef(false);
    const productService = new ProductService();

  
  const [layoutMode, setLayoutMode] = useState("static");
  const [layoutColorMode, setLayoutColorMode] = useState("dark");
  const [staticMenuInactive, setStaticMenuInactive] = useState(false);
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
    let menuClick = false;
    const options = {
      chart: {
        type: "spline"
      },
      title: {
        text: "My chart"
      },
      series: [
        {
          data: [1,3,2,7,5,11,9]
        }
      ]
      
      
    };

    useEffect(() => {
        if (isMounted.current) {
            const summary = expandedRows !== null ? 'All Rows Expanded' : 'All Rows Collapsed';
            //toast.current.show({severity: 'success', summary: `${summary}`, life: 3000});
        }
    }, [expandedRows]);

    useEffect(() => {
        isMounted.current = true;
        productService.getProductsWithOrdersSmall().then(data => setProducts(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onRowExpand = (event) => {
        //toast.current.show({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
    }

    const onRowCollapse = (event) => {
       // toast.current.show({severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000});
    }

    const expandAll = () => {
        let _expandedRows = {};
        products.forEach(p => _expandedRows[`${p.id}`] = true);

        setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    }

    const statusOrderBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.status.toLowerCase()}`}>{rowData.status}</span>;
    }

    const searchBodyTemplate = () => {
        return  <Button icon="pi pi-check" className="p-button-rounded p-button-outlined" />;
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`images/product/${rowData.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />;
    }

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    }

    const ratingBodyTemplate = (rowData) => {
        return  <Chip label="6% less then  the minimum" style={{backgroundColor:'#feca57'}} />
    }

    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    }

   
    const onSidebarClick = () => {
        menuClick = true;
      };
    
      const isSidebarVisible = () => {
        if (isDesktop()) {
          if (layoutMode === "static") return !staticMenuInactive;
          else if (layoutMode === "overlay") return overlayMenuActive;
          else return true;
        }
    
        return true;
      };
      const isDesktop = () => {
        return window.innerWidth > 1024;
      };
      const sidebarClassName = classNames("layout-sidebar", {
        "layout-sidebar-dark": layoutColorMode === "dark",
        "layout-sidebar-light": layoutColorMode === "light",
      });
     const sidebar = useRef();
     const history = useHistory();
     const logo =
      layoutColorMode === "dark"
      ? "assets/layout/images/logo-white.svg"
      : "assets/layout/images/logo.svg";

    const wrapperClass = classNames("layout-wrapper", {
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-static-sidebar-inactive":
          staticMenuInactive && layoutMode === "static",
        "layout-overlay-sidebar-active":
          overlayMenuActive && layoutMode === "overlay",
        "layout-mobile-sidebar-active": mobileMenuActive,
        // "p-input-filled": inputStyle === "filled",
        // "p-ripple-disabled": ripple === false,
      });
    const onToggleMenu = (event) => {
        menuClick = true;
    
        if (isDesktop()) {
          if (layoutMode === "overlay") {
            setOverlayMenuActive((prevState) => !prevState);
          } else if (layoutMode === "static") {
            setStaticMenuInactive((prevState) => !prevState);
          }
        } else {
          setMobileMenuActive((prevState) => !prevState);
        }
        event.preventDefault();
      };
      const onWrapperClick = (event) => {
        if (!menuClick) {
          setOverlayMenuActive(false);
          setMobileMenuActive(false);
        }
        menuClick = false;
      };


    const header = (
        <div className="table-header-container">
           <h5 style={{ fontWeight: "bolder", fontFamily: "Sans-serif" }}>Material Overview</h5>
        </div>
    );
    const header2 = (
      <div className="table-header-container">
         <h5 style={{ fontWeight: "bolder", fontFamily: "Sans-serif" }}>Plant2000</h5>
      </div>
  );
  const header3 = (
    <div className="table-header-container">
       <h5 style={{ fontWeight: "bolder", fontFamily: "Sans-serif" }}>Plant3000</h5>
    </div>
);
    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                {/* <h5>Orders for {data.name}</h5> */}
                <DataTable value={data.orders} responsiveLayout="scroll"  rows={1} >
                    <Column field="id" header="Plant Id(Name)" sortable></Column>
                    <Column field="name" header="Safety Stock" sortable  body={statusOrderBodyTemplate}></Column>
                    <Column field="inventory" header="Inventory" sortable  body={statusOrderBodyTemplate}></Column>
                    <Column field="status" header="WareHouse Capacity" body={statusOrderBodyTemplate} sortable></Column>
                    <Column field="status" header="Status"  body={ratingBodyTemplate} sortable></Column>
                    {/* <Column field="" header="" body={statusOrderBodyTemplate} sortable></Column> */}
                    
                </DataTable>
            </div>
        );
    }
    

    return ( 
        <div >
             {/* <AppTopbar onToggleMenu={onToggleMenu} /> */}
            {/* <Toast ref={toast} /> */}
            <div className='layout-main'>
             <div className="card">
                <DataTable value={products} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} responsiveLayout="scroll"
                    rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={header}      rows={1}>
                    <Column expander style={{ width: '3em' }} />
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="Discription" header="Discription" sortable body={priceBodyTemplate}></Column>
                    <Column field="UOM" header="UOM" sortable body={priceBodyTemplate}></Column>
                    <Column field="Aliases" header="Aliases" sortable body={priceBodyTemplate} />
                    <Column field="Criticality" header="Criticality" sortable body={searchBodyTemplate} />
                    <Column field="SAP" header="SAP" sortable body={priceBodyTemplate} />
                    <Column field="Organisation" header="Organisation" sortable body={searchBodyTemplate} />
                    <Column field="Class" header="Class" sortable body={priceBodyTemplate} />
                </DataTable>
            </div>
            <div className="card">
            <div style={{ display: "", margin: "5px 10px" }}>
            <strong>From Year</strong>
             <Calendar   style={{ width: "15%", margin: "5px 10px" }} id="icon" showIcon value={date1} onChange={(e) => setDate1(e.value)} />
             <strong>To Year</strong>
              <Calendar   style={{ width: "15%", margin: "5px 10px" }} id="icon" showIcon value={date2} onChange={(e) => setDate2(e.value)} />  
              <div>
             <HighchartsReact highcharts={Highcharts} options={options} />
             </div>
           </div>
           
            </div>
            <div className='card'>
           <DataTable 
                   value={products} 
                  //  expandedRows={expandedRows}
                    // onRowToggle={(e) => setExpandedRows(e.data)}
                    // onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} responsiveLayout="scroll"
                    // rowExpansionTemplate={rowExpansionTemplate} 
                    dataKey="id"
                    header={header2}
                    rows={4}
                    >
                    {/* <Column expander style={{ width: '3em' }} /> */}
                    <Column field="" header="" ></Column>
                    <Column field="Discription" header="Jan21"  body={priceBodyTemplate}></Column>
                    <Column field="UOM" header="Feb21"  body={priceBodyTemplate}></Column>
                    <Column field="Aliases" header="Mar21"  body={priceBodyTemplate} />
                    <Column field="Criticality" header="Apr21"  body={searchBodyTemplate} />
                    <Column field="SAP" header="May21"  body={priceBodyTemplate} />
                    <Column field="Organisation" header="Jun21" body={searchBodyTemplate} />
                    <Column field="Class" header="July21"  body={priceBodyTemplate} />
                    <Column field="Aliases" header="Aug21"  body={priceBodyTemplate} />
                    <Column field="Criticality" header="Sep21"  body={searchBodyTemplate} />
                    <Column field="SAP" header="Oct21"  body={priceBodyTemplate} />
                    <Column field="Organisation" header="Nov21" body={searchBodyTemplate} />
                    <Column field="Class" header="Dec21"  body={priceBodyTemplate} />
                </DataTable>
                </div>
                <div className='card'>
               
           <DataTable 
                   value={products} 
                  //  expandedRows={expandedRows}
                  //   onRowToggle={(e) => setExpandedRows(e.data)}
                  //   onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} responsiveLayout="scroll"
                  //   rowExpansionTemplate={rowExpansionTemplate} 
                    dataKey="id"
                    header={header3}
                    rows={5}
                    >
                    {/* <Column expander style={{ width: '3em' }} /> */}
                    <Column field="data" header="" ></Column>
                    <Column field="Discription" header="Jan21"  body={priceBodyTemplate}></Column>
                    <Column field="UOM" header="Feb21"  body={priceBodyTemplate}></Column>
                    <Column field="Aliases" header="Mar21"  body={priceBodyTemplate} />
                    <Column field="Criticality" header="Apr21"  body={searchBodyTemplate} />
                    <Column field="SAP" header="May21"  body={priceBodyTemplate} />
                    <Column field="Organisation" header="Jun21" body={searchBodyTemplate} />
                    <Column field="Class" header="July21"  body={priceBodyTemplate} />
                    <Column field="Aliases" header="Aug21"  body={priceBodyTemplate} />
                    <Column field="Criticality" header="Sep21"  body={searchBodyTemplate} />
                    <Column field="SAP" header="Oct21"  body={priceBodyTemplate} />
                    <Column field="Organisation" header="Nov21" body={searchBodyTemplate} />
                    <Column field="Class" header="Dec21"  body={priceBodyTemplate} />
                </DataTable>
                </div>
            </div>
                {/* <CSSTransition
        classNames="layout-sidebar"
        timeout={{ enter: 200, exit: 200 }}
        in={isSidebarVisible()}
        unmountOnExit
      >
        <div
          ref={sidebar}
          className={sidebarClassName}
          onClick={onSidebarClick}
        >
          <div
            className="layout-logo"
            style={{
              cursor: "pointer",
            }}
            onClick={() => history.push("/")}
          >
            <img
              alt="Logo"
              src={logo}
              style={{
                width: "200px",
                margin: "0px 0px 15px 0px",
              }}
            />
          </div>
          <AppMenu/>
        </div>
                </CSSTransition> */}
        </div>
       
       
    );
}
                 