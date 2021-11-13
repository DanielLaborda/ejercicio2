import React, { Component } from 'react';
import { saveAs } from 'file-saver';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      namefile: ""
    }
    this.createFile = this.createFile.bind(this);
    this.readFile = this.readFile.bind(this); 
    this.checkResult = this.checkResult.bind(this);   
  }
  checkResult() {
    //comprobamos el resultado
    const lines = [];
    let fileCorrupt = false;
    let l = '';
    //leeremos el mensaje 
    //nos aseguramos que tiene 4 lineas y los datos posibles
    
    this.state.message.split('\n').map((i) => {
      if (i.indexOf('\r') >= 0) {
        // si tiene este caracter lo reemplazaremos y borrraremos
        l = i.replace('\r','');
        lines.push(String(l));
      } else {
        lines.push(String(i));
      }
    });

    //comprobamos que sea un numero entero
    const regex = /^[0-9]*$/;
    const onlyNumbers = regex.test(lines[0]); // true es numero
    if (onlyNumbers == true && lines[0] <= 10000){
      if (lines.length - 1 != lines[0]) {
        fileCorrupt = true;
      }
    } else fileCorrupt = true;
    
    let results = [];
    let scores = [];
    let scorepj1 = 0;
    let scorepj2 = 0;
    // fichero comprobado
    if (fileCorrupt == false) {
      let points = [];
      let advantage = 0;
      let leader = 0;
      //Creamos el marcador acumulativo
      for (var i = 1; i < lines.length; i++) {
        points = lines[i].split(" ");
        if(scores.length === 0) {
          advantage = points[0] - points[1];
          if (advantage > 0) {
            leader = 1;
          } else {
            leader = 2;
            advantage = advantage * -1;
          }
          scores.push(["Ronda"+i, parseInt(points[0]), parseInt(points[1]), leader, advantage ]);
        } else {
          scorepj1 = parseInt(points[0]) + parseInt(scores[scores.length-1][1]);
          scorepj2 = parseInt(points[1]) + parseInt(scores[scores.length-1][2]);

          advantage = scorepj1 - scorepj2;
          if (advantage > 0) {
            leader = 1;
          } else {
            leader = 2;
            advantage = advantage * -1;
          }
          scores.push(["Ronda"+i, scorepj1, scorepj2, leader, advantage ]);
        }
        
      }
      //Comprobamos quien es el ganador
      scores.map((score) =>{
        if(results.length === 0) {
          //si aun no hay 
          results = [score[3], score[4]];
        } else {
          // si la ventaja es mayor que la que hay anterior ganador
          if(score[4] > results[1]) {
            results = [score[3], score[4]];
          }
        }
      });
      this.createFile(results[0], results[1]);//la posicion 4 es el jugador que gana y la 3 la ventaja

    } else alert("Fichero equivocado \r\n O necesitamos el fichero correcto");
  
  }
  readFile(e) {
    // leemos el fichero
    const file = e.target.files[0];
    if ( !file ) return;
    const nameFile = e.target.files[0].name;

    const fileReader = new FileReader();

    fileReader.readAsText( file );

    fileReader.onload = () => {
      this.setState({
        message:fileReader.result,
        namefile:nameFile
      });
    }

    fileReader.onerror = () => {
      console.log(fileReader.error);
    }
  }
  createFile(wvalue, avalue) {
    const blob = new Blob([ wvalue, " ",avalue ], {type: 'text/plain;charset=utf-8'});
    saveAs( blob, 'respuesta.txt');
  }
  render() {
    return (
      <div className='app'>
        <div className='header'>
          <h1 className='titulo' data-text='Inserte los puntuajes'>Inserte los puntuajes</h1>
        </div>
        
        <br/>
        <div className='container'>
          <div>
          <input 
            type='file' 
            id='file1'
            className='inputfile'
            multiple={false}
            onChange={ this.readFile }
          />
          <label htmlFor='file1' className='labelInputFile'><i className="fas fa-file-upload"></i> <span>Seleccionar archivo</span></label>
          </div>
          <span className='nameFileSpan'>{this.state.namefile}</span>
        </div>
        
        <br/>
        <div className='buttonContainer'> 
          <button
            className='buttonResults'
            onClick={ this.checkResult }
          >
            ¿Quíen es el ganador?
          </button> 
        </div>
        
      </div>
    );
  }
}