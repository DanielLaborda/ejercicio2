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

    this.state.message.split('\r\n').map((i) => {
      lines.push(String(i));
    });

    //comprobamos que sea un numero entero
    const regex = /^[0-9]*$/;
    const onlyNumbers = regex.test(lines[0]); // true es numero
    if (onlyNumbers == true && lines[0] <= 10000){
      if (lines.length - 1 != lines[0]) {
        fileCorrupt = true;
      }
    } else fileCorrupt = true;
    
    let results = []
    // fichero comprobado
    if (fileCorrupt == false) {
      let points = [];
      let advantage = 0;
      let winner = "";
      let gameWinner = [];
      for (var i = 1; i < lines.length; i++) {
        points = lines[i].split(" ");
        advantage = points[0] - points[1];
        if (advantage > 0) {
          winner = 1;
        } else {
          winner = 2;
          advantage = advantage * -1;
        }
        results.push(["Ronda"+i, points[0], points[1], advantage, winner]);
      }

      for (var x = 0; x < lines.length - 1; x++) { 
        if(gameWinner.length == 0 ){
          gameWinner = results[x];
        } else if (gameWinner[3] < results[x][3]) { 
          //necesito sobreescribir
          gameWinner = results[x];
          console.log("resultado: " + results[x]);
          console.log("ganador: " + gameWinner);
        }
      }
      this.createFile(gameWinner[4], gameWinner[3]);//la posicion 4 es el jugador que gana y la 3 la ventaja

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