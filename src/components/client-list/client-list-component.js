import { LitElement, html } from "lit";
import { styles } from "./client-list-styles";
import { trash, user } from "../../assets/icons";

export class ClientListComponent extends LitElement {
  static styles = [ styles ]

  static properties = {
    clients: { type: Array },
    oneClient: { type: Object }
  };

  constructor() {
    super();
    this.clients = [];
    this.oneClient = {};
  }

  _getYears(date){
    const today = new Date();
    const bornDate = new Date(date);
    return today.getFullYear() - bornDate.getFullYear();
  }

  goBack(){
    this.dispatchEvent(new CustomEvent('on-back-form', 
      { detail: true }, 
      {
      bubbles: true,
      composed: true
    }))
  }

  _removeClient(id, e){
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('on-remove-client', 
      { detail: id },
      {
        bubbles: true,
        composed: true
      } 
    ));
  }

  _setClient(client){
    if(client['id'] === this.oneClient.id){
      this.oneClient = {}
    } else {
      this.oneClient = client
    }
  }

  render() {
    return html`
    <div class="clients">
      <h2>Lista de Clientes</h2>
      <ul class="clients-list scrollbar">
          ${this.clients.map((client) => html`
            <li class=${this.oneClient.id === client['id'] ? '' : 'grow'} @click=${() => this._setClient(client)}>
              <div class="one">
                 ${user}
                <span><b>${client['nombre'].value}</b></span>
                <span>${this._getYears(client['bornDate'].value)} años</span>
                <button class="remove" @click=${(e) => this._removeClient(client['id'], e)}>
                  ${trash}
                </button>
              </div>
                ${this.oneClient.id === client['id'] ? this._renderClientDetail() : ''}
            </li>
          `)}
      </ul>
      
      <div class="actions">
        <button class="change" id="button" type="button" @click=${this.goBack}>
          Regresar
        </button>
      </div>
    </div>
    `;
  }

  _renderClientDetail(){

    if (!this.oneClient || !this.oneClient.nombre || !this.oneClient.nombre.value) {
      return html``
    }

    return  html`
      <div class="card-client">
        <h2>Detalle del Cliente</h2>
        <p><b>Nombre:</b> ${this.oneClient.nombre.value}</p>
        <p><b>Apellidos:</b> ${this.oneClient.apellidos.value}</p>
        <p><b>Correo:</b> ${this.oneClient.correo.value}</p>
        <p><b>Fecha de nacimiento:</b> ${this.oneClient.bornDate.value}</p>
        <p><b>Estado civil:</b> ${this.oneClient.estadocivil.value}</p>
        <p><b>Acepto:</b> ${this.oneClient.acepto.value ? 'Si' : 'No'}</p>
      </div>
    `;
  }
}

customElements.define('client-list', ClientListComponent);