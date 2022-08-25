import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar/NavBar'

import ProductDataService from "../../services/ProductService";
import {Link, useNavigate} from 'react-router-dom';

import './New.scss'
//import axios from 'axios'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// datepicker in spanish
import { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)


function New({logout}) {

  const initialProductState = {
    id: null,
    concepto: "",
    monto: "",
    fecha: "",
    fecha2: "",
    tipo: "",
    categoria: ""
  };
  
  const [product, setProduct] = useState(initialProductState);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  //******************** */
  const history = useNavigate();

  const saveProduct = () => {
  
    if (product.concepto && product.monto && product.fecha && product.fecha2 && product.tipo && product.categoria) {
    
    var data = {
      concepto: product.concepto,
      monto: product.monto,
      fecha: product.fecha,
      fecha2: product.fecha2,
      tipo: product.tipo,
      categoria: product.categoria
    };

    ProductDataService.create(data)
      .then(response => {
        setProduct({
          id: response.data.id,
          concepto: response.data.concepto,
          monto: response.data.monto,
          fecha: response.data.fecha,
          fecha2: response.data.fecha2,
          tipo: response.data.tipo,
          categoria: response.data.categoria
        });
        //console.log(response.data);
        history("/home");
      })
      .catch(e => {
        console.log(e);
      });
      
    }else {
      alert("Faltan Datos")
    }
  };
  
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
      
      setProduct({ ...product, 'fecha': startDate.valueOf(), 'fecha2': b });
    }
    
  };
  
  const handleOnChangeDate = (date) => {
    const a = new Date(date)
    
    setStartDate(a)
  }
  

  return (
    <div className='bgDiv' style={{height: '100vh'}}>
      <NavBar logout={logout} />
      
      <div className="flex1">
        <h1>Nuevo</h1>
        <h6>
          Registrar datos del nuevo paciente.
        </h6>
        
        <div className="submit-form">
          <div className='formFlex'>
            <h4 className='mt-4'>Nuevo Paciente</h4>
            <div className="form-group mb-3">
              <label htmlFor="concepto">Nombre</label>
              <input
                type="text"
                className="form-control input"
                id="concepto"
                required={true}
                value={product.concepto}
                onChange={handleInputChange}
                name="concepto"
                autoComplete='off'
              />
            </div>
  
            <div className="form-group mb-3">
              <label htmlFor="monto">DNI</label>
              <input
                type="text"
                className="form-control input"
                id="monto"
                required={true}
                value={product.monto}
                onChange={handleInputChange}
                name="monto"
                autoComplete='off'
              />
            </div>
            
            {/* <div className="form-group mb-3">
              <label htmlFor="fecha">Date</label>
              <input
                type="text"
                className="form-control input"
                id="fecha"
                required={true}
                value={product.fecha}
                onChange={handleInputChange}
                name="fecha"
                autoComplete='off'
              />
            </div> */}
            
            {/* onChange={(date) => setStartDate(date)} */}
            
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
            
            <div>
              <button onClick={saveProduct} className="btn btn-primary mt-3">
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
    
        </div>
        
      </div>
      
    </div>
  )
}

export default New