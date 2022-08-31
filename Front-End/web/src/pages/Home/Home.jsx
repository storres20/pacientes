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

// Import Modal components
import ModalNew from '../ModalNew/ModalNew'
import ModalNewDate from '../ModalNewDate/ModalNewDate'
import ModalEdit from '../ModalEdit/ModalEdit'


function Home({ logout }) {
  
  // ********************************************
  // useState
  
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

  // *************************************
  // Load Data

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


  // *************************************
  // Filter data - input and input select
  
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
  
  
  // *******************************************************
  // Pagination
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  //const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  const currentPosts = rutas.slice(indexOfFirstPost, indexOfLastPost)
  
  
  // change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  
  
  // **********************************
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
  
  
  // ****************************
  // Modal - Nuevo paciente
  const [show, setShow] = useState(false);
  const handleShow = () => {setShow(true)};
  
  const closeNew = (value) => {
    setShow(value)
  }
  
  const saveNew = (value) => {
    setShow(value)
    obtenerDatos()
  }
  
  
  // ********************************
  // Modal - Nueva Cita
  
  // new date list
  const [list, setList] = useState(false) // contain patient's data to create new date
  
  const [showD, setShowD] = useState(false);
  const handleShowD = (x) => {
    setShowD(true)
    setList(x) // date list
  };
  
  const closeNewD = (value) => {
    setShowD(value)
  }
  
  const saveNewD = (value) => {
    setShowD(value)
    obtenerDatos()
  }
  
  
  // ********************************
  // Modal - Editar Paciente
  
  const [showE, setShowE] = useState(false);
  const handleShowE = (x) => {
    setShowE(true)
    setList(x) // date list
  };
  
  const closeEdit = (value) => {
    setShowE(value)
  }
  
  const saveEdit = (value) => {
    setShowE(value)
    obtenerDatos()
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
          <Button variant="primary" onClick={handleShow} className="mt-3" title='Nuevo Paciente'>
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
                          <div className='d-flex flex-row align-items-baseline justify-content-center'>
                          
                            <Button variant="primary" onClick={() => handleShowD(item)} className="m-1" title='nueva cita'>
                              <i className="bi bi-plus-circle-fill"></i>
                            </Button>
                            
                            <Link to={`/resumen/dni/${item.dni}`} title='resumen cita' className='btn btn-success'>
                              <i className="bi bi-eye-fill"></i>
                            </Link>
                            
                            <Button variant="warning" onClick={() => handleShowE(item)} className="m-1" title='editar paciente'>
                              <i className="bi bi-pencil-fill"></i>
                            </Button>
                            
                            <Button variant="danger"
                            onClick={() => deleteProduct2(`${item.id}`)}
                            title='borrar paciente'
                            >
                              <i className="bi bi-trash-fill"></i>
                            </Button>
                          
                          </div>
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
      
      {/* Modal Nuevo Paciente */}
      <ModalNew show={show} closeShow={(value) => closeNew(value)} saveShow={(value) => saveNew(value)} />
      
      {/* Modal Nueva Cita */}
      <ModalNewDate show={showD} closeShow={(value) => closeNewD(value)} saveShow={(value) => saveNewD(value)} list={list} />
      
      {/* Modal Editar Paciente */}
      <ModalEdit show={showE} closeShow={(value) => closeEdit(value)} saveShow={(value) => saveEdit(value)} list={list} />

    </div>
  )
}

export default Home