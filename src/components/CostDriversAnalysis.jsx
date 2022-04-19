import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import classNames from 'classnames';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../services/ProductService";
import ProcService from "../services/ProcService";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import './App.css';
import { AppMenu } from "./AppMenu";
import { AppTopbar } from "./AppTopbar";
import { CSSTransition } from "react-transition-group";
import { SupplierAnalysis } from './SupplierAnalysis';

export const CostDriversAnalysis = () => {
  const productService = new ProductService();
  const [layoutMode, setLayoutMode] = useState("static");
  const [layoutColorMode, setLayoutColorMode] = useState("dark");
  const [staticMenuInactive, setStaticMenuInactive] = useState(false);
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
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
       <h5 style={{ fontWeight: "bolder", fontFamily: "Poppins" }}>Accuracies</h5>
    </div>
);

  return (
    <div >
      {/* <AppTopbar onToggleMenu={onToggleMenu} /> */}
      {/* <Toast ref={toast} /> */}
      <div className='layout-main'>

        <div className="card">
        <h5 style={{ fontWeight:"bolder", fontFamily:'revert' }}>Cost Drivers Analysis</h5>

          <div style={{ display: "fex", margin: "5px 10px" }}>
            <strong>Source</strong>
            <Dropdown
              style={{ width: "20%", margin: "5px 10px" }}
              value={''}
              options={''}
              optionLabel="name"
              placeholder="ICIS"
              display="chip"

            />
            <strong>Material Name</strong>
            <Dropdown
              style={{ width: "20%", margin: "5px 10px" }}
              value={''}
              options={''}
              optionLabel="name"
              placeholder="Name"
              display="chip"
            />
            <strong>Serial Name</strong>
            <Dropdown
              style={{ width: "20%", margin: "5px 10px" }}
              value={''}
              options={''}
              optionLabel="name"
              placeholder="Name"
              display="chip"
            />
            <Button
              label="Submit"
              style={{ margin: "3px 15px" }}
            />
          </div >
          <div style={{ width: "99%" }}>
          <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
          
        </div>
        <div className="card">
        
          <DataTable
            value={"this.state.demandUITable"}
            //paginator
            header={header}   
            rows={5}
            // rowsPerPageOptions={[5, 10, 20]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          >
            <Column field="plant" header="" />
            <Column field="model" header="Model" />
            <Column
              field="top 3 influsencial indices"
              header="top 3 influsencial indices"
            />
            <Column
              field="test"
              header="test"
            />
         
            <Column field="Discription" header="Jan21"  ></Column>
                    <Column field="UOM" header="Feb21"  ></Column>
                    <Column field="Aliases" header="Mar21" />
                    <Column field="Criticality" header="Apr21" />
                    <Column field="SAP" header="May21" />
                    <Column field="Organisation" header="Jun21" />
            {/* <Column field="2022_10_01" header={`${month8}`} />
            <Column field="2022_11_01" header={`${month9}`} />
            <Column field="2022_12_01" header={`${month10}`} />
            <Column field="2023_01_01" header={`${month11}`} />
            <Column field="2023_02_01" header={`${month12}`} /> */}
           
          </DataTable>
        </div>
        <a href='Materialdatachart'>
            <Button
              label="Back"
              style={{ margin: "3px 15px"  }}
            />
            </a>
        <a href='SupplierAnalysis'>
            <Button
              label="SupplierAnalysis"
              style={{ margin: "3px 15px"  }}
            />
            </a>
      </div>
      
    </div>


  );
}
