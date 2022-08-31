import React, {useState, useEffect} from 'react'

import ProductDataService from "../../services/ProductService";
//import {Link, useNavigate} from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './ModalEdit.scss'


// datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// datepicker in spanish
import { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)


function ModalEdit({show, closeShow, saveShow, list}) {
  
  //console.log(list)
  
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
  // Modal - Nueva Cita
  
  // close modal
  const handleClose = () => {
    //setShowNDate(false)
    setStartDate(null)
    setCurrentProduct(initialProductState2) // set product
    closeShow(false); // close modal
  };
  
  
  const initialProductState2 = {
    id: null,
    nombre: "",
    dni: "",
    fechacita: "",
    fechacita2: "",
    hora: "",
    categoria2: ""
  };
  
  const [currentProduct, setCurrentProduct] = useState(initialProductState2);
  
  // set currentProduct with "nombre" and "dni"
  currentProduct.nombre = list.nombre
  currentProduct.dni = list.dni
  
  
  // ********************************
  // Datepicker
  //const a = new Date()
  //const b = a.valueOf()
  
  const [startDate, setStartDate] = useState(null);
  
  const handleInputChange2 = event => {
    const { name, value } = event.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };
  
  const handleOnChangeDate = (date) => {
    const a = new Date(date)
    
    setStartDate(a)
  }
  
  const handleInputChangeDate2 = () => {
    // startDate to dd/MM/yyyy
    let current = startDate
    
    if (current !== null) {
      let b = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`
      
      //console.log(b) // dd/MM/yyyy
      
      setCurrentProduct({ ...currentProduct, 'fechacita': startDate.valueOf(), 'fechacita2': b });
    }
    
  };
  
  
  // *********************************
  // Registrar button
  const saveDate = () => {
    if (currentProduct.nombre && currentProduct.dni && currentProduct.fechacita && currentProduct.fechacita2 && currentProduct.hora && currentProduct.categoria2) {
    
      var data = {
        nombre: currentProduct.nombre,
        dni: currentProduct.dni,
        fechacita: currentProduct.fechacita,
        fechacita2: currentProduct.fechacita2,
        hora: currentProduct.hora,
        categoria2: currentProduct.categoria2
      };
  
      ProductDataService.createDate(data)
        .then(response => {
          setCurrentProduct({
            id: response.data.id,
            nombre: response.data.nombre,
            dni: response.data.dni,
            fechacita: response.data.fechacita,
            fechacita2: response.data.fechacita2,
            hora: response.data.hora,
            categoria2: response.data.categoria2
          });
          //console.log(response.data);
          alert("Nueva Cita creada con exito!!")
          setStartDate(null)
          setCurrentProduct(initialProductState2) // seteo product
          saveShow(false) // close modal + refresh data
        })
        .catch(e => {
          console.log(e);
        });
        
      }else {
        alert("Faltan Datos")
      }
  };
  

  return (
    <div>
      {/* Modal Nueva Cita */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="flex1 bgDiv pt-5 pb-5">
          <h2>Nueva Cita</h2>
          <p><b>Registrar nueva cita del paciente</b></p>
          
          <div className="submit-form">
            <div className='formFlex'>
              <div className="form-group mb-3">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  className="form-control input"
                  id="nombre"
                  name="nombre"
                  value={currentProduct.nombre }
                  onChange={handleInputChange2}
                  autoComplete='off'
                  disabled
                />
              </div>
    
              <div className="form-group mb-3">
                <label htmlFor="dni">DNI</label>
                <input
                  type="text"
                  className="form-control input"
                  id="dni"
                  name="dni"
                  value={currentProduct.dni}
                  onChange={handleInputChange2}
                  autoComplete='off'
                  disabled
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="fechacita">Fecha Cita</label>
                <DatePicker
                  className="form-control input"
                  dateFormat="dd/MM/yyyy"
                  selected={startDate}
                  placeholderText="--Seleccionar--"
                  
                  id="fechacita"
                  required={true}
                  value={currentProduct.fechacita}
                  onChange={date => handleOnChangeDate(date)}
                  onCalendarClose={handleInputChangeDate2}
                  name="fecha"
                  autoComplete='off'
                  
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  
                  locale="es"
                  minDate={new Date()}
                />
              </div>
              
              
              <div className="form-group mb-3">
                <label htmlFor="hora">Hora</label>
                <select className="form-select input" aria-label="Default select example"
                  id="hora"
                  required={true}
                  value={currentProduct.hora}
                  onChange={handleInputChange2}
                  name="hora"
                >
                  <option>--Seleccionar--</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                </select>
              </div>
              
              
              <div className="form-group mb-3">
                <label htmlFor="categoria2">Servicio / Especialidad</label>
                <select className="form-select input" aria-label="Default select example"
                  id="categoria2"
                  required={true}
                  value={currentProduct.categoria2}
                  onChange={handleInputChange2}
                  name="categoria2"
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
                <Button variant="primary" onClick={saveDate}>Registrar</Button>
              </div>
              
            </div>
      
          </div>
          
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ModalEdit