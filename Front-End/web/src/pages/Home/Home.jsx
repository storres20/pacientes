import React, { useState, useEffect, useRef } from 'react'
//import axios from 'axios'
import NavBar from '../../components/NavBar/NavBar'
import Pagina from '../../components/Pagina/Pagina'
import ProductDataService from "../../services/ProductService"

import {Link} from 'react-router-dom'

import './Home.scss'
//import './Loading.scss'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import Table from 'react-bootstrap/Table';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Modal from 'react-bootstrap/Modal';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// datepicker in spanish
import { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)


function Home({ logout }) {

  const [rutas, setRutas] = useState([]);
  const [allData, setAllData] = useState([]);
  const [categorias, setCategorias] = useState([]); // list category
  const [loading, setLoading] = useState(false) // loading
  const [noData, setNoData] = useState(false)  // noData
  
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  const obtenerDatos = () => {
    // GET request for remote image in node.js
    ProductDataService.getAll()
      .then(res => {
        //console.log(res.data);
        setRutas(res.data)
        setAllData(res.data)
        
        setLoading(true) // loading
        
      })
  }

  const obtenerCategorias = () => {
    // GET request for remote image in node.js
    ProductDataService.getAll2()
      .then(res => {
        //console.log(res.data);
        setCategorias(res.data)
      })
  }

  useEffect(() => {
    obtenerDatos();
    obtenerCategorias();
  }, [])


  const handleSearch = (event) => {
    const keyword = event.target.value;

    if (keyword !== '') {
      const results = allData.filter((user) => {
        //return user.title.toLowerCase().startsWith(keyword.toLowerCase());
        return user.nombre.toLowerCase().includes(keyword.toLowerCase()) || user.dni.includes(keyword);
        // Use the toLowerCase() method to make it case-insensitive
      });

      inputRef2.current.value = "--Todos--";
      setRutas(results);
      setCurrentPage(1)
      
      if (results.length === 0) {
        setNoData(true) // no data
      }
      else setNoData(false)

    } else {
      setRutas(allData);
      setCurrentPage(1)
      setNoData(false) // no data
      // If the text field is empty, show all users
    }

  }


  const handleCategory = (event) => {
    const keyword = event.target.value;

    if (keyword !== '--Todos--') {
      const results = allData.filter((user) => {
        //return user.title.toLowerCase().startsWith(keyword.toLowerCase());
        return user.categoria.toLowerCase().includes(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });

      inputRef.current.value = "";
      setRutas(results);
      setCurrentPage(1)
      
      if (results.length === 0) {
        setNoData(true) // no data
      }
      else setNoData(false)

    } else {
      setRutas(allData);
      setCurrentPage(1)
      setNoData(false) // no data
      // If the text field is empty, show all users
    }

  }
  
  
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  //const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  const currentPosts = rutas.slice(indexOfFirstPost, indexOfLastPost)
  
  
  // change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  
  
  // button delete
  const deleteProduct2 = (id) => {
  
    if (window.confirm("Desea ELIMINAR el paciente ?") === true) {
      ProductDataService.remove(id)
      .then(response => {
        //console.log(response.data);
        //window.location.reload(true);
        obtenerDatos()
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };
  
  
  // Modal - Nuevo paciente
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  
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

  const handleInputChange = event => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };
  
  
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
        //history("/home");
        obtenerDatos() // refresca listado de pacientes
        alert("Paciente creado con exito!!")
        setShow(false) // close modal
        setStartDate(null)
        setProduct(initialProductState) // seteo product
      })
      .catch(e => {
        console.log(e);
      });
      
    }else {
      alert("Faltan Datos")
    }
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
      
      setProduct({ ...product, 'fecha': startDate.valueOf(), 'fecha2': b });
    }
    
  };
  
  const handleOnChangeDate = (date) => {
    const a = new Date(date)
    
    setStartDate(a)
  }

  return (
    <div style={{height: '100vh'}}  className='bgDiv'>
      <NavBar logout={logout} />

      <Card className='bgDiv'>
        <Card.Body>
          <Card.Title><h1>Bienvenido</h1></Card.Title>
          <Card.Text>
          Este sistema le permite visualizar el listado de pacientes
          </Card.Text>

          <Card.Title>Listado:</Card.Title>
          
          <InputGroup className="mt-3 mb-3">
            <InputGroup.Text id="basic-addon1">Total de pacientes:</InputGroup.Text>
            <Form.Label className="label"><span>{allData.length}</span></Form.Label>
          </InputGroup>


          <Form>
            <Container>
              <Row className='flexCol'>
                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Busqueda:</Form.Label>
                    <Form.Control
                      placeholder="Ingresar nombre o DNI"
                      aria-label="Ingresar nombre"
                      aria-describedby="basic-addon2"
                      className='inputLar'
                      autoComplete="off"
                      onChange={event => handleSearch(event)}
                      ref={inputRef}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Servicio / Especialidad:</Form.Label>
                    <Form.Select aria-label="Floating label select example" onChange={event => handleCategory(event)} ref={inputRef2}>
                      <option>--Todos--</option>
                      {
                        categorias.map(item => (
                          <option key={item.id} value={item.nombre}>{item.nombre}</option>
                        ))
                      }
                    </Form.Select>
                  </Form.Group>
                </Col>

              </Row>
            </Container>
          </Form>
          
          {/* "New" button */}
          <Button variant="primary" onClick={handleShow} className="mt-3">
            <i className="bi bi-plus-circle-fill"></i> Nuevo
          </Button>
          
          {loading ? (
          
            <Card>
              <Card.Body  className='bgDiv'>
              
                <Pagina postsPerPage={postsPerPage} totalPosts={rutas.length} paginate={paginate} currentPage={currentPage} />
    
                <Table striped bordered hover size="md" responsive >
                  <thead>
                    <tr>
                      <th className='text-center'>N°</th>
                      <th>Nombre</th>
                      <th className='text-center'>DNI</th>
                      <th className='text-center'>Fecha Nacimiento</th>
                      <th className='text-center'>Sexo</th>
                      <th className='text-center'>Servicio / Especialidad</th>
                      <th className='text-center'>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPosts.map((item, index) => (
                      <tr key={item.id}>
                        <td className='text-center'>{index+1}</td>
                        <td>{item.nombre}</td>
                        <td className='text-center'>{item.dni}</td>
                        <td className='text-center'>{item.fecha2}</td>
                        <td className='text-center'>{item.tipo}</td>
                        <td className='text-center'>{item.categoria}</td>
                        <td className='text-center'>
                          <Link to={`/newdate/${item.id}`} title='nueva cita' className='btn btn-primary m-1'>
                            <i className="bi bi-plus-circle-fill"></i>
                          </Link>
                          <Link to={`/resumen/dni/${item.dni}`} title='resumen cita' className='btn btn-success'>
                            <i className="bi bi-eye-fill"></i>
                          </Link>
                          <Link
                            className='btn btn-warning m-1'
                            to={`/edit/${item.id}`}
                            title='editar paciente'
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </Link>
                          <button className="btn btn-danger"
                          onClick={() => deleteProduct2(`${item.id}`)}
                          title='borrar paciente'
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
    
    
                  </tbody>
                </Table>
                
                {noData ? (
                
                  <div className='text-center'>
                    <h2>No data to show</h2>
                  </div>
                
                ) : ("")}
                
                <Pagina postsPerPage={postsPerPage} totalPosts={rutas.length} paginate={paginate} currentPage={currentPage} />
    
              </Card.Body>
            </Card>
          
          ) : (
          
            <div className="flexLoad" >
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
          
          )}
          
          

        </Card.Body>
      </Card>
      
      
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

export default Home