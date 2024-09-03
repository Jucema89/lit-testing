import { html, LitElement } from 'lit';
import { styles } from './input-checkbox-app-styles';

export class InputCheckboxAppComponent extends LitElement {
  static styles = [ styles ]

  static properties = {
    id: { type: String },
    label: { type: String },
    placeholder: { type: String },
    name: { type: String },
    disabled: { type: Boolean },
    checked: { type: Boolean },
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
    this.disabled = false;
    this.checked = false;
    this.clear = false;
    this.validation = {
      required: false,
    },
    this._dirty = false;
    this._errorMessage = ''
  }

  updated(changedProperties) {
    if (changedProperties.has('clear')) {
      this._handleClear();
    }
  }

  _handleClear(){
    if (this.clear) {
      this.checked = false;
      this._dirty = false;
      this._errorMessage = '';
    }
  }

  _handleValue(){
    this.checked = !this.checked;
    this._dirty = true;
    const name = `on-checked-${this.id}`
    this.dispatchEvent(new CustomEvent(name, {
      detail: {
        value: this.checked,
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

    if(this.validation.required && !this.checked){
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

        <input 
        class=${this._isValid ? 'valid' : 'invalid'}
        name=${this.name} 
        type="checkbox"
        ?disabled=${this.disabled} 
        @change=${this._handleValue} 
        .checked=${this.checked}
        .required=${this.validation.required}
        autocomplete="off">

      </label>
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

customElements.define('input-checkbox', InputCheckboxAppComponent);