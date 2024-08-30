import { html, css, LitElement } from 'lit';
import'./components/input-component/input-app-component.js';

export class TestingApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--testing-app-text-color, #000);
    }
  `;

  static properties = {
    header: { type: String },
    isActive: { type: Boolean }
  };

  constructor() {
    super();
    this.header = 'Hey there';
    this.isActive = false;
  }

  get buttonComponent() {
    return this.shadowRoot.getElementById('button');
  }

  register() {
   
    console.log('Registrando...');
    if(this.isActive){
      console.log('Active true... ', this.isActive)
    } else {
      console.log('Active false... ', this.isActive)
    }

    this.dispatchEvent(new CustomEvent('on-register-event', {
      detail: 'Hello'
      // detail: {
      //   codigo: this.shadowRoot.getElementById('codigo').value,
      //   nombres: this.shadowRoot.getElementById('nombres').value,
      //   apellidos: this.shadowRoot.getElementById('apellidos').value,
      //   correo: this.shadowRoot.getElementById('correo').value,
      //   fecnac: this.shadowRoot.getElementById('fecnac').value,
      //   estadocivil: this.shadowRoot.getElementById('estadocivil').value,
      //   acepto: this.shadowRoot.getElementById('acepto').checked
      // }
    }, 
    {
      bubbles: true,
      composed: true
    }));
  }

  _handleInputNombre(e){
    console.log('Nombre - ', e.detail );
  }

  _submitData(e){
    console.log('_submitData = ', e)
  }

  render() {
    return html`
      <h2>${this.header}</h2>
      <form onsubmit=${this._submitData}>
        <div>
          <label>Codigo:</label>
          <input type="text" id="codigo" name="codigo">
        </div>
        <div>
          <!-- <label>Nombres:</label>
          <input type="text" id="nombres" name="nombres"> -->
          <input-app
            id="nombre"
            name="nombre"
            label="Nombre"
            .disabled=${false}
            .validation=${{required: true, minLength: 3, maxLength: 10}}
            @on-input-nombre=${this._handleInputNombre}>
          </input-app>

        </div>
        <div>
          <label>Apellidos:</label>
          <input type="text" id="apellidos" name="apellidos">
        </div>
        <div>
          <label>Correo:</label>
          <input type="text" id="correo" name="correo">
        </div>
        <div>
          <label>Fecha de nacimiento:</label>
          <input type="date" id="fecnac" name="fecnac">
        </div>
        <div>
          <select id="estadocivil" name="estadocivil">
            <option value="soltero">Soltero</option>
            <option value="casado">Casado</option>
            <option value="divorciado">Divorciado</option>
            <option value="viudo">Viudo</option>
          </select>
        </div>
        <div>
          <input type="checkbox" id="acepto" name="acepto">
          <label for="acepto">Acepto los terminos y condiciones</label>
        </div>
  
        <button type="submit" >Registrar</button>

      </form>
      
    `;
  }
}
