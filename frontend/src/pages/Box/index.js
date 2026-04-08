import React, { Component } from 'react';
import api from "../../services/api";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Dropzone from 'react-dropzone';
import { io } from "socket.io-client";

import { MdInsertDriveFile } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import logo from "../../assets/logo.svg";
import './styles.css';

const socket = io("https://cloudbox-production-d43f.up.railway.app", {
  transports: ["websocket"],
});

class Box extends Component { 
  state = { box: {} };

  async componentDidMount() {
    this.subscribeToNewFiles();

    const box = this.props.params.id;

    const response = await api.get(`boxes/${box}`);
    this.setState({ box: response.data });
  }

  subscribeToNewFiles = () => {
    const box = this.props.params.id;

    socket.emit('connectRoom', box);

    socket.on('file', data => {
      this.setState(prevState => {
        // 🔥 evita duplicação
        const alreadyExists = prevState.box.files?.some(
          file => file._id === data._id
        );

        if (alreadyExists) return prevState;

        return {
          box: {
            ...prevState.box,
            files: [data, ...(prevState.box.files || [])],
          },
        };
      });
    });
  };

  handleUpload = async (files) => {
    const box = this.props.params.id;

    for (const file of files) {
      const data = new FormData();
      data.append('file', file);

      try {
        // 🔥 aguarda resposta do backend
        const response = await api.post(`boxes/${box}/files`, data);

        // 🔥 atualização imediata (sem depender do socket)
        this.setState(prevState => ({
          box: {
            ...prevState.box,
            files: [response.data, ...(prevState.box.files || [])],
          },
        }));

      } catch (err) {
        console.error("Erro no upload:", err);
      }
    }
  };
  
  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste arquivos ou clique aqui</p>  
            </div>
          )}
        </Dropzone>

        <ul>
          {this.state.box.files && this.state.box.files.map(file => (
            <li key={file._id}>
              <a 
                className="fileinfo" 
                href={file.url} 
                target="_blank" 
                rel="noreferrer"
              >
                <MdInsertDriveFile size={24} color="#A5CFFF" />
                <strong>{file.title}</strong>
              </a>

              <span>
                há{" "}
                {formatDistanceToNow(new Date(file.createdAt), {
                  locale: ptBR,
                })}
              </span>
            </li>
          ))}
        </ul> 
      </div>
    );
  }
}

function withParams(Component) {
  return (props) => {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
}

export default withParams(Box);