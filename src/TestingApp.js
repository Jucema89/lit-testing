import { html, css, LitElement } from 'lit';
import { Styles } from './TestingAppStyle.js';
import './components/form'
import './components/client-list/client-list-component.js'
export class TestingApp extends LitElement {
  static styles = [
    Styles
  ]

  static properties = {
    optionsCivilState: { type: Array },
    showClients: { type: Boolean },
    formData: { type: Object },
    buttonSendDisabled: { type: Boolean },
    optionsClientType: { type: Array },
    clients: { type: Array },
    clearForm: { type: Boolean }
  };

  constructor() {
    super();
    this.showClients = false;
    this.clients = [];
    this.buttonSendDisabled = true;
    this.clearForm = false;
    this.optionsCivilState = [
      { value: 'soltero', label: 'Soltero' },
      { value: 'casado', label: 'Casado' },
      { value: 'divorciado', label: 'Divorciado' },
      { value: 'viudo', label: 'Viudo' }
    ];
    this.optionsClientType = [
      {label: 'Nacional', value: 'nal'}, 
      { label: 'Internacional', value: 'int'}
    ]

    this.formData = {
      codigo: {
        value: '',
        valid: false
      },
      nombre:{
        value: '',
        valid: false
      },
      apellidos:{
        value: '',
        valid: false
      },
      typeClient:{
        value: '',
        valid: false
      },
      correo:{
        value: '',
        valid: false
      },
      bornDate:{
        value: '',
        valid: false
      },
      estadocivil:{
        value: '',
        valid: false
      },
      acepto:{
        value: false,
        valid: false
      }
    }
  }

  register() {
    this.clients = [
      ...this.clients,
      {
        id: this.clients.length + 1,
        ...this.formData
      }
    ];

    this.formData = {
      codigo: {
        value: '',
        valid: false
      },
      nombre:{
        value: '',
        valid: false
      },
      apellidos:{
        value: '',
        valid: false
      },
      typeClient:{
        value: '',
        valid: false
      },
      correo:{
        value: '',
        valid: false
      },
      bornDate:{
        value: '',
        valid: false
      },
      estadocivil:{
        value: '',
        valid: false
      },
      acepto:{
        value: false,
        valid: false
      }
    }

    this.clearForm = true;
    this.buttonSendDisabled = true;
    setTimeout(() => {
      this.clearForm = false;
    }, 1000);
  }

  viewClients(){
    this.showClients = !this.showClients
  }

  _handleInput(e, nameInput){
    if(e.detail.valid){
      this.formData[nameInput].value = e.detail.value;
      this.formData[nameInput].valid = e.detail.valid;

      this.buttonSendDisabled = Object.values(this.formData).some((item) => !item || !item.valid)
    } else {
      this.buttonSendDisabled = true;
    }
  }

  _handleRemoveClient(event){
    this.clients = [...this.clients.filter((client) => client.id !== event.detail)];
  }

  render(){
    return html`
     <section class="card" >
     ${this.showClients ? this._renderClients() : this._renderForm()}
    </section>
    `
  }

  _renderForm() {
    return html`
      <form class=${this.showClients ? 'rotate' : ''}>
        <h2>
          Registro de Clientes
        </h2>
        <div>
          <input-number
            id="codigo"
            name="codigo"
            label="Codigo"
            .disabled=${false}
            .clear=${this.clearForm}
            .validation=${{required: true, minLength: 3, maxLength: 30}}
            @on-input-codigo=${(e) => this._handleInput(e, 'codigo')}>
          </input-number>
        </div>
        <div>
          <input-text
            id="nombre" 
            name="nombre"
            label="Nombre"
            .disabled=${false}
            .clear=${this.clearForm}
            .validation=${{required: true, minLength: 3, maxLength: 30}}
            @on-input-nombre=${(e) => this._handleInput(e, 'nombre')}>
          </input-text>
        </div>
        <div>
          <input-text
            id="apellidos" 
            name="apellidos"
            label="Apellidos"
            .disabled=${false}
            .clear=${this.clearForm}
            .validation=${{required: true, minLength: 3, maxLength: 30}}
            @on-input-apellidos=${(e) => this._handleInput(e, 'apellidos')}>
          </input-text>
        </div>
        <div>
          <input-text
            id="correo" 
            name="correo"
            label="Correo"
            .disabled=${false}
            .clear=${this.clearForm}
            .validation=${{
              required: true, 
              minLength: 3, 
              pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/}
            }
            @on-input-correo=${(e) => this._handleInput(e, 'correo')}>
          </input-text>
        </div>
        <div class="duo">
          <div>
            <input-date
              id="bornDate"
              name="bornDate"
              label="Fecha de nacimiento"
              .clear=${this.clearForm}
              .validation=${{
                required: true,
                onlyAfterToday: false
              }}
              @on-date-bornDate=${(e) => this._handleInput(e, 'bornDate')}>
            </input-date>
          </div>
          <div>
            <select-input
              id="estadocivil"
              name="estadocivil"
              label="Estado Civil"
              .validation=${{required: true}}
              placeholder="Seleccione un estado civil"
              .disabled=${false}
              .clear=${this.clearForm}
              .options=${this.optionsCivilState}
              @on-select-estadocivil=${(e) => this._handleInput(e, 'estadocivil')}>
            </select-input>
          </div>
        </div>
        <div>
          <input-radio
            id="typeClient"
            name="typeClient"
            label="Tipo de Cliente"
            .validation=${{required: true}}
            .disabled=${false}
            .options=${this.optionsClientType}    
            .clear=${this.clearForm}
            @on-radio-typeClient=${(e) => this._handleInput(e, 'typeClient')}>
          </input-radio>
        </div>
        <div>
          <input-checkbox
            id="acepto"
            name="acepto"
            label="Acepto los terminos y condiciones"
            .validation=${{ required: true }}
            .clear=${this.clearForm}
            @on-checked-acepto=${(e) => this._handleInput(e, 'acepto')}>
          </input-checkbox>
        </div>
        <div class="actions">
          <button class="send" id="button" type="button" 
            .disabled=${this.buttonSendDisabled} 
            @click=${this.register}>
            Guardar
          </button>
          <button 
            class="change" 
            type="button" 
            .disabled=${!this.clients.length} 
            @click=${this.viewClients}>
            Ver Clientes
          </button>
        </div>
      </form>
    `;
  }

  _renderClients(){
    return html`
    <client-list
      .clients=${this.clients}
      @on-remove-client=${this._handleRemoveClient}
      @on-back-form=${this.viewClients}>
    </client-list>
    `
  }
}