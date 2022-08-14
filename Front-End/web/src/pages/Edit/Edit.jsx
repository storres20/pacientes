import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar/NavBar'

import {Link, useParams, useNavigate} from 'react-router-dom'

import ProductDataService from "../../services/ProductService"

import './Edit.scss'
//import './Loading.scss'

//import axios from 'axios'

// Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// datepicker in spanish
import { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)


function Edit({logout}) {

  const initialProductState = {
    id: null,
    concepto: "",
    monto: "",
    fecha: "",
    fecha2: "",
    tipo: "",
    categoria: ""
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
      
      setCurrentProduct({ ...currentProduct, 'fecha': startDate.valueOf(), 'fecha2': b });
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
        <h1>Editar</h1>
        <h6>
          Editar datos del paciente.
        </h6>
        
        {loading ? (
          <div>
            
            <div className="edit-form">
              <h4>Editar Paciente</h4>
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="concepto">Nombre</label>
                  <input
                    type="text"
                    className="form-control input"
                    id="concepto"
                    name="concepto"
                    value={currentProduct.concepto}
                    onChange={handleInputChange}
                    autoComplete='off'
                  />
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="monto">DNI</label>
                  <input
                    type="text"
                    className="form-control input"
                    id="monto"
                    name="monto"
                    value={currentProduct.monto}
                    onChange={handleInputChange}
                    autoComplete='off'
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
                  {/* <input
                    type="text"
                    className="form-control input"
                    id="tipo"
                    name="tipo"
                    value={currentProduct.tipo}
                    onChange={handleInputChange}
                  /> */}
                  <select className="form-select input" aria-label="Default select example"
                    id="tipo"
                    required={true}
                    value={currentProduct.tipo}
                    onChange={handleInputChange}
                    name="tipo"
                  >
                    {/* <option>--Seleccionar--</option> */}
                    <option value="masculino">masculino</option>
                    <option value="femenino">femenino</option>
                  </select>
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="categoria">Categoria</label>
                  <select className="form-select input" aria-label="Default select example"
                    id="categoria"
                    required={true}
                    value={currentProduct.categoria}
                    onChange={handleInputChange}
                    name="categoria"
                  >
                    {/* <option>--Seleccionar--</option> */}
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
                Actualizar
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

export default Edit