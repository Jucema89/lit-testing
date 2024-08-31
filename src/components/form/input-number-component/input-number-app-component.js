import { html, LitElement } from 'lit';
import { styles } from './input-number-app-styles';

export class InputNumberAppComponent extends LitElement {
  static styles = [ styles ]

  static properties = {
    id: { type: String },
    label: { type: String },
    placeholder: { type: String },
    name: { type: String },
    disabled: { type: Boolean },
    value: { type: String },
    validation: { type: Object },
    clear: { type: Boolean },
    _dirty: { type: Boolean },
    _errorMessage: { type: String },
    _runValidate: { type: Boolean }
  };

  constructor() {
    super();
    this.id = '';
    this.label = '';
    this.placeholder = '';
    this.name = '';
    this.disabled = false;
    this.value = '';
    this.validation = {
      required: false,
      minLength: 0,
      maxLength: 0,
      pattern: ''
    },
    this._dirty = false;
    this._runValidate = false;
    this._errorMessage = ''
    this.clear = false;
  }

  _timerAwait(time){
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time)
    })
  }

  updated(changedProperties) {
    if (changedProperties.has('clear')) {
      this._handleClear();
    }
  }

  _handleClear() {
    if (this.clear) {
      this.value = '';
      this._dirty = false;
      this._runValidate = false;
      this._errorMessage = '';
    }
  }

  async _handleValue(e){
    const name = `on-input-${this.id}`
    this.value = e.target.value;
    this._dirty = true;
      this.dispatchEvent(new CustomEvent(name, {
        detail: {
          value: this.value,
          valid: this._isValid
        }
      }, {
        bubbles: true,
        composed: true
      }));
  }

  get _isValid(){

    if(!this._runValidate && !this._dirty){
      return true
    }

    if(this._runValidate && this.validation.required && this.value === ''){
      this._errorMessage = 'El campo es requerido';
      return false;
    }

    if(this._runValidate && !this.value.match(/^[0-9]+$/)){
      this._errorMessage = 'El campo solo puede contener números';
      return false;
    }

    if(this._runValidate && this.validation.minLength && this.value.length < this.validation.minLength){
      this._errorMessage = `El campo debe tener al menos ${this.validation.minLength} caracteres`;
      return false;
    }
    if(this._runValidate && this.validation.maxLength && this.value.length > this.validation.maxLength){
      this._errorMessage = `El campo debe tener menos de ${this.validation.maxLength} caracteres`;
      return false;
    }

    if(this._runValidate && this.validation.pattern && !this.value.match(this.validation.pattern)){
      this._errorMessage = 'El campo no cumple con el formato requerido';
      return false;
    }

    return true;
  }
 
  render() {
    return html`
    <div class="control">
      <label class=${this._isValid ? 'label' : 'label error'}>
        ${this.label} ${this.validation.required ? '*' : ''}
      </label>
      <input 
        class=${this._isValid ? 'valid' : 'invalid'}
        name=${this.name} 
        type="number"
        ?disabled=${this.disabled} 
        @input=${this._handleValue}
        @blur=${() => this._runValidate = true}
        .value=${this.value}
        .pattern=${this.validation.pattern}
        .required=${this.validation.required}
        autocomplete="off">
        ${!this._isValid ? this._renderErrorMessages() : ''}
    </div>
    `;
  }

  _renderErrorMessages(){
    return html`
      <div class="message">
        <span class="message-error">⛔ ${this._errorMessage}</span>
      </div>
    `;
  }
}

customElements.define('input-number', InputNumberAppComponent);
