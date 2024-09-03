import { html, LitElement } from 'lit';
import { styles } from './select-app-styles';

export class SelectAppComponent extends LitElement {
  static styles = [ styles ]

  static properties = {
    id: { type: String },
    label: { type: String },
    options: { type: Array }, //{label: string, value: string}[]
    placeholder: { type: String },
    name: { type: String },
    disabled: { type: Boolean },
    clear: { type: Boolean },
    value: { type: String },
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
    this.disabled = false;
    this.clear = false;
    this.value = '';
    this.validation = {
      required: false
    },
    this.options = [];
    this._dirty = false;
    this._errorMessage = ''
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
      this._errorMessage = '';
    }
  }

   _handleValue(e){
    this._dirty = true;
    const name = `on-select-${this.id}`
    this.value = e.target.value;
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

    if(!this._dirty){
      return true
    }
    if(this.validation.required && this.value === ''){
      this._errorMessage = 'El campo es requerido';
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
      <select
        class=${this._isValid ? 'valid' : 'invalid'}
        name=${this.name} 
        ?disabled=${this.disabled} 
        @blur=${() => this._dirty = true}
        @change=${this._handleValue} 
        .value=${this.value}
        .required=${this.validation.required}
      >
      ${this.options.map((option) => html`
        <option value="" disabled selected hidden>${this.placeholder}</option>
        <option value=${option.value}>${option.label}</option>
      `)}
      </select>
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

customElements.define('select-input', SelectAppComponent);
