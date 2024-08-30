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
    this.disabled = false;
    this.checked = false;
    this.validation = {
      required: false,
    },
    this.dirty = false;
    this.errorMessage = ''
  }

   _handleValue(e){
    this.checked = !this.checked;
    this.dirty = true;
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

    if(!this.dirty){
      return true
    }

    if(this.validation.required && this.value === ''){
      this.errorMessage = 'El campo es requerido';
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
        type="checkbox"
        ?disabled=${this.disabled} 
        @change=${this._handleValue} 
        .checked=${this.checked}
        .required=${this.validation.required}
        autocomplete="off">
        ${!this._isValid ? this._renderErrorMessages() : ''}
    </div>
    `;
  }

  _renderErrorMessages(){
    return html`
      <div class="message">
        <span class="message-error">⛔ ${this.errorMessage}</span>
      </div>
    `;
  }
}

customElements.define('input-checkbox-app', InputCheckboxAppComponent);
