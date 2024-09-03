import { html, LitElement } from 'lit';
import { styles } from './input-radio-app-styles';

export class InputRadioAppComponent extends LitElement {
  static styles = [ styles ]

  static properties = {
    id: { type: String },
    label: { type: String },
    placeholder: { type: String },
    name: { type: String },
    options: { type: Array },
    disabled: { type: Boolean },
    checkedOption: { type: String },
    clear: { type: Boolean },
    validation: { type: Object },
    _dirty: { type: Boolean },
    _errorMessage: { type: String }
  };

  constructor() {
    super();
    this.id = '';
    this.label = '';
    this.placeholder = '';
    this.name = '';
    this.checkedOption = '';
    this.options = [];
    this.disabled = false;
    this.clear = false;
    this.validation = {
      required: false,
    },
    this._dirty = false;
    this.errorMessage = ''
  }

  updated(changedProperties) {
    if (changedProperties.has('clear')) {
      this._handleClear();
    }
  }

  _handleClear(){
    if (this.clear) {
      this.checkedOption = '';
      this._dirty = false;
      this._errorMessage = '';
    }
  }

  _handleValue(event){
    this.checkedOption = event.target.value;
    this._dirty = true;
    const name = `on-radio-${this.id}`
    this.dispatchEvent(new CustomEvent(name, {
      detail: {
        value: event.target.value,
        valid: event.target.value === '' ? false : this._isValid
      }
    }, {
      bubbles: true,
      composed: true
    }));
  }

  get _isValid(){

    if(!this._dirty){
      return true
    }

    if(this.validation.required && this.checkedOption === ''){
      this.errorMessage = 'El campo es requerido';
      return false;
    }

    return true;
  }

  render() {
    return html`
    <div class="control">
      <label class=${this._isValid ? 'label' : 'label error'}>${this.label} ${this.validation.required ? '*' : ''}</label>
      <div class="options">
        ${this._renderOptions()}
      </div>
      
      ${!this._isValid ? this._renderErrorMessages() : ''}
    </div>
    `;
  }

  _renderOptions(){
    return this.options.map((option) => html`
      <label class="label-input">
      ${option.label}
      <input 
        class=${this._isValid ? 'valid' : 'invalid'}
        name=${this.name} 
        type="radio"
        ?disabled=${this.disabled} 
        @change=${this._handleValue}
        .checked=${this.checkedOption === option.value}
        .value=${option.value}
        .id=${option.value}
        .required=${this.validation.required}
      >
      </label>
    `)
  }

  _renderErrorMessages(){
    return html`
      <div class="message">
        <span class="message-error">⛔ ${this.errorMessage}</span>
      </div>
    `;
  }
}

customElements.define('input-radio', InputRadioAppComponent);
