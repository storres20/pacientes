import React, {useState, useEffect} from 'react'

import ProductDataService from "../../services/ProductService";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './ModalNew.scss'


// datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// datepicker in spanish
import { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)


function ModalNew({show, closeShow, saveShow}) {
  
  // ********************************
  // setting product
  
  const initialProductState = {
    id: null,
    nombre: "",
    dni: "",
    fecha: "",
    fecha2: "",
    tipo: "",
    categoria: ""
  };
  
  const [product, setProduct] = useState(initialProductState);
  
  
  // ****************************
  // Categories
  const [categorias, setCategorias] = useState([]); // list category
  
  // servicio / especialidad modal list
  const obtenerCategorias = () => {
    // GET request for remote image in node.js
    ProductDataService.getAll2()
      .then(res => {
        //console.log(res.data);
        setCategorias(res.data)
      })
  }
  
  useEffect(() => {
    obtenerCategorias();
  }, [])

  // ****************************
  // Modal - Nuevo paciente
  
  // Close Modal
  const handleClose = () => {
    //setShow(false)
    setStartDate(null) // set datepicker
    setProduct(initialProductState) // set product
    closeShow(false); // close modal
  };
  
  
  // *******************************************
  // save data after click on "Registrar" button
  
  const saveProduct = () => {
  
    if (product.nombre && product.dni && product.fecha && product.fecha2 && product.tipo && product.categoria) {
    
    var data = {
      nombre: product.nombre,
      dni: product.dni,
      fecha: product.fecha,
      fecha2: product.fecha2,
      tipo: product.tipo,
      categoria: product.categoria
    };

    ProductDataService.create(data)
      .then(response => {
        setProduct({
          id: response.data.id,
          nombre: response.data.nombre,
          dni: response.data.dni,
          fecha: response.data.fecha,
          fecha2: response.data.fecha2,
          tipo: response.data.tipo,
          categoria: response.data.categoria
        });
        //console.log(response.data);
        alert("Paciente creado con exito!!")
        setStartDate(null)
        setProduct(initialProductState) // seteo product
        saveShow(false) // close modal + refresh data
      })
      .catch(e => {
        console.log(e);
      });
      
    }else {
      alert("Faltan Datos")
    }
  };
  
  
  // ********************************
  // Datepicker
  //const a = new Date()
  //const b = a.valueOf()
  
  const [startDate, setStartDate] = useState(null);
  
  const handleOnChangeDate = (date) => {
    const a = new Date(date)
    
    setStartDate(a)
  }
  
  
  // ****************************************
  // UPDATE currentProduct with INPUT's value

  const handleInputChange = event => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };
  
  
  // ****************************************
  // UPDATE currentProduct with Datepicker
  
  const handleInputChangeDate = () => {
    // startDate to dd/MM/yyyy
    let current = startDate
    
    if (current !== null) {
      let b = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`
      
      //console.log(b) // dd/MM/yyyy
      
      setProduct({ ...product, 'fecha': startDate.valueOf(), 'fecha2': b });
    }
    
  };
  
  
  return (
    <div>
      {/* Modal Nuevo Paciente */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="flex1 bgDiv pt-5 pb-5">
          <h2>Nuevo Paciente</h2>
          <p><b>Registrar datos del nuevo paciente</b></p>
          
          <div className="submit-form">
            <div className='formFlex'>
              <div className="form-group mb-3">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  className="form-control input"
                  id="nombre"
                  required={true}
                  value={product.nombre}
                  onChange={handleInputChange}
                  name="nombre"
                  autoComplete='off'
                />
              </div>
    
              <div className="form-group mb-3">
                <label htmlFor="dni">DNI</label>
                <input
                  type="text"
                  className="form-control input"
                  id="dni"
                  required={true}
                  value={product.dni}
                  onChange={handleInputChange}
                  name="dni"
                  autoComplete='off'
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="fecha">Fecha Nacimiento</label>
                <DatePicker
                  className="form-control input"
                  dateFormat="dd/MM/yyyy"
                  selected={startDate}
                  placeholderText="--Seleccionar--"
                  
                  id="fecha"
                  required={true}
                  value={startDate}
                  onChange={date => handleOnChangeDate(date)}
                  onCalendarClose={handleInputChangeDate}
                  name="fecha"
                  autoComplete='off'
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  
                  locale="es"
                />
              </div>
              
              
              <div className="form-group mb-3">
                <label htmlFor="tipo">Sexo</label>
                <select className="form-select input" aria-label="Default select example"
                  id="tipo"
                  required={true}
                  value={product.tipo}
                  onChange={handleInputChange}
                  name="tipo"
                >
                  <option>--Seleccionar--</option>
                  <option value="masculino">masculino</option>
                  <option value="femenino">femenino</option>
                </select>
              </div>
              
              
              <div className="form-group mb-3">
                <label htmlFor="categoria">Servicio / Especialidad</label>
                <select className="form-select input" aria-label="Default select example"
                  id="categoria"
                  required={true}
                  value={product.categoria}
                  onChange={handleInputChange}
                  name="categoria"
                >
                  <option>--Seleccionar--</option>
                  {
                    categorias.map(item => (
                      <option key={item.id} value={item.nombre}>{item.nombre}</option>
                    ))
                  }
                </select>
              </div>
              
              <div className='mt-5 text-center'>
                <Button variant="secondary" onClick={handleClose}>
                  Cerrar
                </Button>
                <Button variant="primary" onClick={saveProduct}>Registrar</Button>
              </div>
              
            </div>
      
          </div>
          
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ModalNew