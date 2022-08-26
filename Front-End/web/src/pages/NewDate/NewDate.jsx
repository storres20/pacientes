import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar/NavBar'

import {Link, useParams, useNavigate} from 'react-router-dom'

import ProductDataService from "../../services/ProductService"

import './NewDate.scss'
//import './Loading.scss'

//import axios from 'axios'

// Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// datepicker in spanish
import { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)


function NewDate({logout}) {

  const initialProductState = {
    id: null,
    nombre: "",
    dni: "",
    fechacita: "",
    fechacita2: "",
    hora: "",
    categoria2: ""
  };
  
  const [loading, setLoading] = useState(false) // loading
  const [currentProduct, setCurrentProduct] = useState(initialProductState);
  const params = useParams() // get the ID from a URL
  //console.log(params.id)
  
  const history = useNavigate() // 
  
  const getProduct = id => {
    ProductDataService.get(id)
      .then(response => {
        setCurrentProduct(response.data);
        //console.log(response.data);
        setLoading(true) // loading
      })
      .catch(e => {
        console.log(e);
        setLoading(true) // loading
      });
  };
  
  
  useEffect(() => {
    getProduct(params.id);
  }, [params]);
  
  
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };
  
  
  const updateProduct = () => {
    //console.log(currentProduct);
    ProductDataService.update(currentProduct.id, currentProduct)
      .then(response => {
        //console.log(response.data);
        /* setMessage("The Product was updated successfully!"); */
        history("/home");
      })
      .catch(e => {
        console.log(e);
      });
  };
  
  
  // Datepicker
  //const a = new Date()
  //const b = a.valueOf()
  
  const [startDate, setStartDate] = useState(null);
  
  
  const handleInputChangeDate = () => {
    // startDate to dd/MM/yyyy
    let current = startDate
    
    if (current !== null) {
      let b = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`
      
      //console.log(b) // dd/MM/yyyy
      
      setCurrentProduct({ ...currentProduct, 'fechacita': startDate.valueOf(), 'fechacita2': b });
    }
    
  };
  
  const handleOnChangeDate = (date) => {
    const a = new Date(date)
    
    setStartDate(a)
  }
  
  
  // Category
  const [categorias, setCategorias] = useState([]); // list category
  
  const obtenerCategorias = () => {
    // GET request for remote image in node.js
    //axios.get('http://localhost:3001/api/categories')
    //axios.get('https://pacientes20-back.herokuapp.com/api/categories')
    ProductDataService.getAll2()
      .then(res => {
        //console.log(res.data);
        setCategorias(res.data)
      })
  }

  useEffect(() => {
    obtenerCategorias();
  }, [])
  

  return (
    <div className='bgDiv' style={{height: '100vh'}}>
      <NavBar logout={logout} />
      
      <div className="flex1">
        <h1>Nueva Cita</h1>
        <h6>
          Registrar Nueva Cita del paciente.
        </h6>
        
        {loading ? (
          <div>
            
            <div className="edit-form">
              <h4 className='mt-4'>Nueva Cita</h4>
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    className="form-control input"
                    id="nombre"
                    name="nombre"
                    value={currentProduct.nombre}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    autoComplete='off'
                    disabled
                  />
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="fechacita">Fecha Cita</label>
                  <DatePicker
                    className="form-control input"
                    dateFormat="dd/MM/yyyy"
                    selected={currentProduct.fechacita}
                    
                    id="fechacita"
                    required={true}
                    value={currentProduct.fechacita}
                    onChange={date => handleOnChangeDate(date)}
                    onCalendarClose={handleInputChangeDate}
                    name="fechacita"
                    autoComplete='off'
                    
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    
                    locale="es"
                  />
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="hora">Hora</label>
                  {/* <input
                    type="text"
                    className="form-control input"
                    id="tipo"
                    name="tipo"
                    value={currentProduct.tipo}
                    onChange={handleInputChange}
                  /> */}
                  <select className="form-select input" aria-label="Default select example"
                    id="hora"
                    required={true}
                    value={currentProduct.hora}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
    
              </form>
    
    
              <button
                type="submit"
                className="btn btn-primary mt-3"
                onClick={updateProduct}
              >
                Registrar
              </button>
              
              <Link
                to={"/home"}
                className="btn btn-danger mt-3"
              >
                Atras
              </Link>
              
            </div>
          </div>
        ) : (
          <div className="flexLoad">
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
          </div>
        )}
        
      </div>
    
    </div>
  )
}

export default NewDate