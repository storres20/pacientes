import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import ProductDataService from "../../services/ProductService";

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
  /* Redux */
  const categorias = useSelector((state) => state.categories);
  
  //console.log(list)
  
  // ********************************
  // setting currentProduct
  
  const initialProductState = {
    _id: null,
    nombre: "",
    dni: "",
    fecha: "",
    fecha2: "",
    tipo: "",
    categoria: ""
  };
  
  
  const [currentProduct, setCurrentProduct] = useState(initialProductState);
  const [loading, setLoading] = useState(false) // loading
  
  
  // *****************************
  // Patient's data
  
  useEffect(() => {
    setCurrentProduct(list)
    setLoading(true) // loading
  }, [list])
  
  
  // ****************************
  // Modal - Editar Paciente
  
  // close modal
  const handleClose = () => {
    //setShowNDate(false)
    setStartDate(null)
    //setCurrentProduct(initialProductState) // set product
    closeShow(false); // close modal
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
  
  const handleInputChange2 = event => {
    const { name, value } = event.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };
  
  
  // ****************************************
  // UPDATE currentProduct with Datepicker
  
  const handleInputChangeDate2 = () => {
    // startDate to dd/MM/yyyy
    let current = startDate
    
    if (current !== null) {
      let b = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`
      
      //console.log(b) // dd/MM/yyyy
      
      setCurrentProduct({ ...currentProduct, 'fecha': startDate.valueOf(), 'fecha2': b });
    }
    
  };
  
  
  // *********************************
  // Registrar button
  const updateProduct = () => {
    //console.log(currentProduct);
    ProductDataService.update(currentProduct._id, currentProduct)
      .then(response => {
        //console.log(response.data);
        /* setMessage("The Product was updated successfully!"); */
        alert("Datos del Paciente editado con exito!!")
        setStartDate(null)
        setCurrentProduct(initialProductState) // seteo product
        saveShow(false) // close modal + refresh data
      })
      .catch(e => {
        console.log(e);
      });
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
          <h2>Editar Paciente</h2>
          <p><b>Editar datos del paciente</b></p>
          
          {loading ? (
            
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
                    required={true}
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
                    required={true}
                  />
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="fecha">Fecha Nacimiento</label>
                  <DatePicker
                    className="form-control input"
                    dateFormat="dd/MM/yyyy"
                    selected={currentProduct.fecha}
                    
                    id="fecha"
                    required={true}
                    value={currentProduct.fecha}
                    onChange={date => handleOnChangeDate(date)}
                    onCalendarClose={handleInputChangeDate2}
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
                    value={currentProduct.tipo}
                    onChange={handleInputChange2}
                    name="tipo"
                  >
                    {/* <option>--Seleccionar--</option> */}
                    <option value="masculino">masculino</option>
                    <option value="femenino">femenino</option>
                  </select>
                </div>
                
                
                <div className="form-group mb-3">
                  <label htmlFor="categoria">Servicio / Especialidad</label>
                  <select className="form-select input" aria-label="Default select example"
                    id="categoria"
                    required={true}
                    value={currentProduct.categoria}
                    onChange={handleInputChange2}
                    name="categoria"
                  >
                    {/* <option>--Seleccionar--</option> */}
                    {
                      categorias.map(item => (
                        <option key={item._id} value={item.nombre}>{item.nombre}</option>
                      ))
                    }
                  </select>
                </div>
                
                <div className='mt-5 text-center'>
                  <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                  </Button>
                  <Button variant="primary" onClick={updateProduct}>Registrar</Button>
                </div>
                
              </div>
        
            </div>
            
          ) : (
            <div className="flexLoad">
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
          )}
          
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ModalEdit