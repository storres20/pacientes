import React, { useState, useEffect, useRef } from 'react'
//import axios from 'axios'
import NavBar from '../../components/NavBar/NavBar'
import Pagina from '../../components/Pagina/Pagina'
import ProductDataService from "../../services/ProductService"

import {Link} from 'react-router-dom'

import './Dates.scss'
//import './Loading.scss'

//import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import Table from 'react-bootstrap/Table';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// datepicker in spanish
import { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
registerLocale('es', es)


function Dates({ logout }) {

  const [rutas, setRutas] = useState([]);
  const [allData, setAllData] = useState([]);
  const [categorias, setCategorias] = useState([]); // list category
  const [loading, setLoading] = useState(false) // loading
  const [noData, setNoData] = useState(false)  // noData
  const [startDate, setStartDate] = useState(null);
  
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const inputRef = useRef(null);
  const inputRef2 = useRef(null);
  
  

  const obtenerDatos = (x) => {
    
    if (x !== null) {
    
      let fecha = x.valueOf();
      //console.log(fecha)
      // GET request for remote image in node.js 1662742735000
      ProductDataService.getDate(fecha)
        .then(res => {
          //console.log(res.data);
          setRutas(res.data)
          setAllData(res.data)
          
          setLoading(true) // loading
          //console.log(res)
          if (res.length === 0) {
            setNoData(true) // no data
          }
          else setNoData(false)
          
        })
        .catch(e => {
          setLoading(true) // loading
          setNoData(true) // no data
          setRutas([])
        });
        
    }else{
    
      setLoading(true) // loading
      setNoData(true) // no data
    
    }
      
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
    obtenerDatos(startDate);
    obtenerCategorias();
  }, [startDate])


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
        return user.categoria2.toLowerCase().includes(keyword.toLowerCase());
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
        window.location.reload(true);
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };
  
  
  const handleOnChangeDate = (date) => {
    const a = new Date(date)
    //console.log(a.valueOf())
    
    setStartDate(a)
    
    
  }


  return (
    <div style={{height: '100vh'}}  className='bgDiv'>
      <NavBar logout={logout} />

      <Card className='bgDiv'>
        <Card.Body>
          <Card.Title><h1>Citas</h1></Card.Title>
          <Card.Text>
          Esta página le permite visualizar los <b>pacientes citados</b> según la <b>fecha del calendario</b>
          </Card.Text>

          <Card.Title>Listado:</Card.Title>
          
          <InputGroup className="mt-3 mb-3">
            <InputGroup.Text id="basic-addon1">Fecha de Cita:</InputGroup.Text>
            <DatePicker
                className="form-control"
                wrapperClassName='input2'
                dateFormat="dd/MM/yyyy"
                selected={startDate}
                placeholderText="--Seleccionar--"
                
                id="fecha"
                required={true}
                value={startDate}
                onChange={date => handleOnChangeDate(date)}
                onCalendarClose={() => obtenerDatos(startDate)}
                //onChange={(date) => setStartDate(date)}
                name="fecha"
                autoComplete='off'
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                
                locale="es"
              />
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
          {/* <Link to={"/new"} title='Nuevo Paciente'><Button variant="primary"><i className="bi bi-plus-circle"></i> Nuevo</Button></Link> */}
          
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
                      <th className='text-center'>Fecha de Cita</th>
                      <th className='text-center'>Hora</th>
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
                        <td className='text-center'>{item.fechacita2}</td>
                        <td className='text-center'>{item.hora}</td>
                        <td className='text-center'>{item.categoria2}</td>
                        <td className='text-center'>
                          <div className='d-flex flex-row align-items-baseline justify-content-center'>
                            <Link to={"#"} title='nueva cita' className='btn btn-primary m-1'>
                              <i className="bi bi-plus-circle-fill"></i>
                            </Link>
                            <Link to={"#"} title='resumen cita' className='btn btn-success'>
                              <i className="bi bi-eye-fill"></i>
                            </Link>
                            <Link
                              className='btn btn-warning m-1'
                              to={"#"}
                              title='editar paciente'
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </Link>
                            <button className="btn btn-danger"
                            title='borrar paciente'
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
    
    
                  </tbody>
                </Table>
                
                {noData ? (
                
                  <div className='text-center'>
                    <h2>No hay pacientes programados.</h2>
                    <h3>Seleccionar otra fecha</h3>
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

    </div>
  )
}

export default Dates