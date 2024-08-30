import { html, LitElement } from 'lit';
import { styles } from './input-app-styles';

export class InputAppComponent extends LitElement {
  static styles = [ styles ]

  static properties = {
    id: { type: String },
    label: { type: String },
    placeholder: { type: String },
    name: { type: String },
    type: { type: String },
    disabled: { type: Boolean },
    value: { type: String },
    validation: { type: Object },
    dirty: { type: Boolean },
    errorMessage: { type: String }
  };

  constructor() {
    super();
    this.id = '';
    this.label = '';
    this.placeholder = '';
    this.name = '';
    this.type = 'text';
    this.disabled = false;
    this.value = '';
    this.validation = {
      required: false,
      minLength: 0,
      maxLength: 0,
      pattern: ''
    },
    this.dirty = false;
    this.errorMessage = ''
  }

   _handleValue(e){
    this.dirty = true;
    const name = `on-input-${this.id}`
    this.value = e.target.value;
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent(name, {
        detail: {
          value: this.value,
          valid: this._isValid
        }
      }, {
        bubbles: true,
        composed: true
      }));
    }, 800)
  }

  render() {
    return html`
    <div class="control">
      <label class=${this._isValid ? 'label' : 'label error'}>
        ${this.label} ${this.validation.required ? '*' : ''}
      </label>
      <input 
        class=${this._isValid ? 'valid' : 'invalid'}
        .type=${this.type} 
        name=${this.name} 
        ?disabled=${this.disabled} 
        @input=${this._handleValue} 
        .value=${this.value}
        .pattern=${this.validation.pattern}
        .required=${this.validation.required}
        autocomplete="off">
        ${!this._isValid ? this._renderErrorMessages() : ''}
    </div>
    `;
  }

  get _isValid(){

    if(!this.dirty){
      return true
    }
    if(this.validation.required && this.value === ''){
      this.errorMessage = 'El campo es requerido';
      return false;
    }
    if(this.validation.minLength && this.value.length < this.validation.minLength){
      this.errorMessage = `El campo debe tener al menos ${this.validation.minLength} caracteres`;
      return false;
    }
    if(this.validation.maxLength && this.value.length > this.validation.maxLength){
      this.errorMessage = `El campo debe tener menos de ${this.validation.maxLength} caracteres`;
      return false;
    }
    if(this.validation.pattern && !this.value.match(this.validation.pattern)){
      this.errorMessage = 'El campo no cumple con el formato requerido';
      return false;
    }

    return true;
  }

  _renderErrorMessages(){
    return html`
      <div class="message">
        <span class="message-error">⛔ ${this.errorMessage}</span>
      </div>
    `;
  }
}

customElements.define('input-app', InputAppComponent);
