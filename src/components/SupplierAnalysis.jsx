import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
//import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
// import { classNames } from "primereact/utils";
import classNames from "classnames";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";



import { MultiSelect } from "primereact/multiselect";
// import { Dropdown } from 'primereact/dropdown';

import ProcService from "../services/ProcService";
import {ProductService} from "../services/ProductService";

export class SupplierAnalysis extends Component {
  emptyProduct = {
    id: null,
    name: "",
    quality: 0,
    price: 0,
    Material_Number: "",
    Composition: 0,
    Percentage: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      materialCostDriverOutput: [],
      materialInfo: [],
      costDriver: this.props.location.state ? this.props.location.state.costDriver : null,
      seriesName: this.props.location.state ? this.props.location.state.seriesName : [],
      plant: this.props.location.state ? this.props.location.state.plant : null,
      products: this.props.location.state ? this.props.location.state.products : [],
      countries: [],
      product: this.emptyProduct,
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      selectedProducts: null,
      submitted: false,
      globalFilter: null,
      filteredCountries: null,
      selectedCity1: null,
      selectedCity2: null,
      filteredCities: null,
    };

    this.cities = [
      {
        name: "Film Posted DEL India 0-7 Days",
        code: "Film Posted DEL India 0-7 Days",
      },
      {
        name: "HDPE Blow Mould Domestic FD EU no-data",
        code: "HDPE Blow Mould Domestic FD EU no-data",
      },
      {
        name: "Flat Yarn (Raffia) Spot DEL India W 0-7 Days",
        code: "Flat Yarn (Raffia) Spot DEL India W 0-7 Days",
      },
      {
        name: "HDPE Film Domestic FD EU no-data",
        code: "HDPE Film Domestic FD EU no-data",
      },
    ];

    this.plants = [
      { label: "1200", value: "1200" },
      { label: "1500", value: "1500" },
      { label: "1800", value: "1800" },
      { label: "2000", value: "2000" },
      { label: "3300", value: "3300" },
      { label: "4100", value: "4100" },
    ];

    this.countries = [
      {
        name: "Polypropylene (Middle East)",
        code: "Polypropylene (Middle East)",
      },
      { name: "Polyethylene (Europe)", code: "Polyethylene (Europe)" },
    ];

    this.searchCountry = this.searchCountry.bind(this);
    this.editingCellRows = {};
    this.originalRows = {};
    this.productService = new ProductService();
    this.procService = new ProcService();
    this.saveProduct = this.saveProduct.bind(this);

    ///////////////////////////////// Aashish
    this.hideDialog = this.hideDialog.bind(this);
    this.openNew = this.openNew.bind(this);
    this.actionBodyTemplate = this.actionBodyTemplate.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.confirmDeleteProduct = this.confirmDeleteProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
   // this.leftToolbarTemplate = this.leftToolbarTemplate.bind(this);
    this.onInputChange = this.onInputChange.bind(this);

    ///////////////////////////////// Aashish
    this.onRowEditInit = this.onRowEditInit.bind(this);
    this.onRowEditCancel = this.onRowEditCancel.bind(this);
    this.onRowEditCancel2 = this.onRowEditCancel2.bind(this);
    this.onRowEditChange = this.onRowEditChange.bind(this);
    // this.onEditorInit = this.onEditorInit.bind(this);
    this.onInputNumberChange = this.onInputNumberChange.bind(this);
    this.hideDeleteProductDialog = this.hideDeleteProductDialog.bind(this);
    this.hideDeleteProductsDialog = this.hideDeleteProductsDialog.bind(this);
    this.onCityChange = this.onCityChange.bind(this);
  }

  componentDidMount() {
    this.procService.getMaterialCostDriverOutput({ material: 7001733 }).then((data) => this.setState({ materialCostDriverOutput: data.data.Sheet3 }));

    this.procService.getMaterialInfo({ material: 7001733 }).then((data) => {
      console.log("data in optimization=====>", data);
     // data = data.data.data.filter((d) => d.material === "7001733");
      return this.setState({ materialInfo: data });
    });

    // this.procService
    //   .getPlants()
    //   .then((data) => console.log("getPlants =====>", data));
  }
 

  Onsave = () => {
    // console.log("Onsave", this.state.data);

    const { costDriver, seriesName, products, plant } = this.state;
    this.props.history.push("/SupplierAnalysis", {
      costDriver,
      seriesName,
      products,
      plant,
    });
  };

  SubmitValueselectedCity1 = (e) => {
    //console.log(this.state.selectedCity1);
    this.props.handleData(this.state.selectedCity1);
  };
  onCityChange = (e) => {
    this.setState({ selectedCity1: e.target.value });
  };

  onPlantChange = (e) => {
    this.setState(
      { plant: e.target.value }
      //console.log("e in onPlantChange", e)
    );
  };
  // nextPath(path) {
  //   this.props.history.push(path);
  // }
  searchCountry(event) {
    setTimeout(() => {
      let filteredCountries;
      if (!event.query.trim().length) {
        filteredCountries = [...this.state.countries.name];
      } else {
        filteredCountries = this.countries.filter((country) => {
          // console.log('MyCountry' , country);
          // console.log("ab", country.name);
          return country.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      this.setState({ filteredCountries });
    }, 250);
  }

  onEditorValueChange(productKey, props, value) {
    let updatedProducts = [...props.value];
    updatedProducts[props.rowIndex][props.field] = value;
    this.setState({ [`${productKey}`]: updatedProducts });
  }

  statusEditor(productKey, props) {
    return (
      <Dropdown
        value={props.rowData["inventoryStatus"]}
        options={this.statuses}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => this.onEditorValueChange(productKey, props, e.value)}
        style={{ width: "100%" }}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return <span className={`product-badge status-${option.value.toLowerCase()}`}>{option.label}</span>;
        }}
      />
    );
  }

  inputTextEditor(productKey, props, field) {
    return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(productKey, props, e.target.value)} />;
  }

  nameEditor(productKey, props) {
    return this.inputTextEditor(productKey, props, "name");
  }

  // quatityEditor(productKey, props) {
  //   return this.inputTextEditor(productKey, props, 'quantity');
  // }

  quatityEditor(productKey, props) {
    return (
      // <InputNumber
      //   value={props.rowData["quantity"]}
      //   onValueChange={(e) =>
      //     this.onEditorValueChange(productKey, props, e.value)
      //   }
      // />
      <InputText type="text" value={props.rowData["quantity"]} onChange={(e) => this.onEditorValueChange(productKey, props, e.target.value)} />
    );
  }

  priceEditor(productKey, props) {
    return <InputNumber value={props.rowData["price"]} onValueChange={(e) => this.onEditorValueChange(productKey, props, e.value)} />;
  }
  leadTime = (productKey, props) => {
    return <InputNumber value={props.rowData["Percentage"]} onValueChange={(e) => this.onEditorValueChange(productKey, props, e.value)} />;
  };

  onEditorSubmit(e) {
    const { rowIndex: index, field } = e.columnProps;
    delete this.editingCellRows[index][field];
  }

  onRowEditInit(event) {
    this.originalRows[event.index] = { ...this.state.products[event.index] };
  }

  onRowEditCancel(event) {
    let products = [...this.state.products];
    products[event.index] = this.originalRows[event.index];
    delete this.originalRows[event.index];

    this.setState({ products3: products });
  }

  onRowEditInit2(event) {
    this.originalRows2[event.index] = { ...this.state.products4[event.index] };
  }

  onRowEditChange(event) {
    this.setState({ editingRows: event.data });
  }
  onRowEditCancel2(event) {
    let products = [...this.state.products4];
    products[event.index] = this.originalRows2[event.index];
    delete this.originalRows2[event.index];
    this.setState({ products4: products });
  }

  openNew() {
    this.setState({
      product: this.emptyProduct,
      submitted: false,
      productDialog: true,
    });
  }
  hideDialog() {
    this.setState({
      submitted: false,
      productDialog: false,
    });
  }
  hideDeleteProductDialog() {
    this.setState({ deleteProductDialog: false });
  }

  hideDeleteProductsDialog() {
    this.setState({ deleteProductsDialog: false });
  }

  saveProduct() {
    let state = { submitted: true };

    if (this.state.product.name.trim()) {
      let products = [...this.state.products];
      let product = { ...this.state.product };
      if (this.state.product.id) {
        const index = this.findIndexById(this.state.product.id);

        products[index] = product;
        this.toast.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        product.id = this.createId();
        product.image = "product-placeholder.svg";
        products.push(product);
        this.toast.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      state = {
        ...state,
        products,
        productDialog: false,
        product: this.emptyProduct,
      };
    }

    this.setState(state);
  }

  createId() {
    let id = "";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  editProduct(product) {
    this.setState({
      product: { ...product },
      productDialog: true,
    });
  }
  ///////////////////////////////

  ///////////////// Aashish

  confirmDeleteProduct(product) {
    this.setState({
      product,
      deleteProductDialog: true,
    });
  }

  deleteProduct() {
    let products = this.state.products.filter((val) => val.id !== this.state.product.id);
    this.setState({
      products,
      deleteProductDialog: false,
      product: this.emptyProduct,
    });
    this.toast.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  }

  onInputChange(e, name) {
    const val = (e.target && e.target.value) || "";
    let product = { ...this.state.product };

    //console.log("{product : ====>", product);

    product[`${name}`] = val;

    this.setState({ product });
  }

  onInputNumberChange(e, name) {
    const val = e.value || 0;
    let product = { ...this.state.product };
    product[`${name}`] = val;
    //console.log("{product in onInputNumberChange : ====>", product);
    this.setState({ product });
  }

  

  actionBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <Button icon="pi pi-trash" className="p-button-text p-button-secondary" onClick={() => this.confirmDeleteProduct(rowData)} style={{ width: "30px" }} />
      </React.Fragment>
    );
  }

  /////////

  render() {
    //console.log("state in Demo", this.state);
    let seriesData = [];
    // console.log("costDriver", this.state.costDriver);
    // console.log(this.state.products);
    // console.log("MYPROPS", this.props);
    if (this.state.seriesName.length > 0) {
      seriesData = this.state.seriesName.map((el, i) => {
        return { index: i + 1, series: el.name };
      });
    }

    // <Forcast />;
    const productDialogFooter = (
      <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={this.saveProduct} />
      </React.Fragment>
    );
    const deleteProductDialogFooter = (
      <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteProductDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteProduct} />
      </React.Fragment>
    );
    const deleteProductsDialogFooter = (
      <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteProductsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteSelectedProducts} />
      </React.Fragment>
    );
    
   const chartoptions = {
      chart: {
        type: "spline"
      },
      title: {
        text: ''
      },
      series: [
        {
          data: [1,3,2,7,5,11,9]
        }
      ]
      
      
    };
    const chartoptions2 = {
      chart: {
        type: "spline"
      },
      title: {
        text: ''
      },
      series: [
        {
          data: [3,1,2,8,5,1,9]
        }
      ]
      
      
    };
    const header2 = (
      <div className="table-header-container">
         <h5 style={{ fontWeight: "bolder", fontFamily: "Poppins" }}>Enter Supplier Information </h5>
      </div>
  );

    return (
      <div className='layout-main'>

        <div className="card ">
        <h5 style={{ fontWeight:"bolder", fontFamily:'poppins' }}>Supplier Analysis</h5>
          <div className="row" style={{ display: "flex", justifyContent:'center', fontFamily: "Poppins" }}>
            <div className="col-8" style={{ width: "63%" }}>
              <Toast ref={(el) => (this.toast = el)} />

             

              <DataTable
              header={header2}
                value={this.state.products}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                editMode="row"
                dataKey="id"
                onRowEditInit={this.onRowEditInit}
                onRowEditCancel={this.onRowEditCancel}
              >
                <Column field="name" header="Supplier Name" editor={(props) => this.nameEditor("products", props)} />

                <Column field="quantity" header="Formula/Fixed Price" editor={(props) => this.quatityEditor("products", props)} />
                <Column field="price" header="Max Capacity" editor={(props) => this.priceEditor("products", props)} />
                <Column field="Percentage" header="Lead Time" editor={(props) => this.leadTime("products", props)} />
                <Column
                  rowEditor
                  style={{ width: "13%" }}
                  // headerStyle={{ width: "7rem" }}
                  // bodyStyle={{ textAlign: "center" }}
                ></Column>
                <Column body={this.actionBodyTemplate} style={{ width: "10%" }}></Column>
              </DataTable>
              <div style={{ float: "",display:'flex',justifyContent:'space-between', margin: "10px 30px" }}>
                <Button
                label="Add More Supplier"
                icon="pi pi-plus"
               // className="p-mr-2"
               onClick={this.openNew}
                 />
                <Button
                  className="btn btn-success btn-lg float-right"
                  // onClick={() => this.nextPath("/Forcast")}
                  label="Submit"
                  onClick={this.Onsave}
                />
               
               
              </div>
            </div>

            {/* ======================right coloumn=============================== */}
           

            {/* ===================================================== */}
          </div>
        </div>
        <div className="card">
        <h5 style={{ fontWeight: "bolder", fontFamily: "Poppins" }}>Historical Unit Prices</h5>
                <div style={{ display: "flex", justifyContent:'center', margin: "5px 10px" ,fontFamily: "Poppins"}}>
                  <Dropdown
                    style={{ width: "30%", margin: "5px 10px" }}
                    value={this.state.costDriver}
                    options={this.costDrivers}
                    onChange={(e) => this.onCostDriverChange(e)}
                    optionLabel="name"
                    placeholder="Choose Plants"
                    display="chip"
                  />

                  <Dropdown
                    style={{ width: "30%", margin: "5px 10px",fontFamily: "Poppins" }}
                    value={this.state.costDriverSeries}
                    options={this.seriesName}
                    onChange={(e) => this.oncostDriverSeriesChange(e)}
                    optionLabel="name"
                    placeholder="Region"
                    display="chip"
                  />
                  <Button
                 label="submit"
                 style={{ margin: "3px 15px"  }}
            />
                </div>
                <div style={{ width: "100%" }}>
                  <HighchartsReact highcharts={Highcharts} options={chartoptions} />
                </div>
                
                <h5 style={{ fontWeight: "bolder", fontFamily: "Poppins" }}>Forecasted Supplier Priceing</h5>
                <div style={{ width: "100%" }}>
                  
                  <HighchartsReact highcharts={Highcharts} options={chartoptions} />
                </div>
              </div>

        {/* ===================================================== */}

        <Dialog visible={this.state.productDialog} style={{ width: "600px" }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={this.hideDialog}>
          <div className="p-field">
            <label htmlFor="Material_Number">Supplier Name</label>
            <InputText
              id="name"
              value={this.state.product.name}
              onChange={(e) => this.onInputChange(e, "name")}
              required
              autoFocus
              className={classNames({
                "p-invalid": this.state.submitted && !this.state.product.name,
              })}
            />
            {this.state.submitted && !this.state.product.name && <small className="p-error">Supplier Name is required.</small>}
          </div>

          {/* <div className="p-formgrid p-grid"> */}
          <div className="p-field">
            <label htmlFor="quantity">Formula/Fixed Price</label>
            <InputText id="quantity" value={this.state.product.quantity} onChange={(e) => this.onInputChange(e, "quantity")} required />
            {this.state.submitted && !this.state.product.quantity && <small className="p-error">Formula/Fixed Price is required.</small>}
          </div>

          <div className="p-field">
            <label htmlFor="price">Max Capacity</label>
            <InputNumber id="price" value={this.state.product.price} onValueChange={(e) => this.onInputNumberChange(e, "price")} required />
            {this.state.submitted && !this.state.product.price && <small className="p-error">Max Capacity is required.</small>}
          </div>

          <div className="p-field">
            <label htmlFor="Percentage">Lead Time</label>
            <InputNumber id="Percentage" value={this.state.product.Percentage} onValueChange={(e) => this.onInputNumberChange(e, "Percentage")} required />
            {this.state.submitted && !this.state.product.Percentage && <small className="p-error">Lead Time is required.</small>}
          </div>
          {/* </div> */}
        </Dialog>

        {/* ======================================================= */}

        <Dialog visible={this.state.deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={this.hideDeleteProductDialog}>
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: "2rem" }} />
            {this.state.product && (
              <span>
                Are you sure you want to delete <b>{this.state.product.name}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog visible={this.state.deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={this.hideDeleteProductsDialog}>
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: "2rem" }} />
            {this.state.product && <span>Are you sure you want to delete the selected products?</span>}
          </div>
        </Dialog>
        <a href='SupplierAnalysis'>
            <Button
              label="Back"
              style={{ margin: "3px 15px"  }}
            />
            </a>
        <a href='Inventory'>
            <Button
              label="Inventory"
              style={{ margin: "3px 15px"  }}
            />
            </a>
      </div>
      
    );
  }
}
