import { html, LitElement } from 'lit';
import { styles } from './input-date-app-styles';

export class InputDateAppComponent extends LitElement {
  static styles = [ styles ]

  static properties = {
    id: { type: String },
    label: { type: String },
    placeholder: { type: String },
    name: { type: String },
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
    this.disabled = false;
    this.value = '';
    this.validation = {
      required: false,
      minDate: '',
      maxDate: '',
      onlyAfterToday: false
    },
    this.dirty = false;
    this.errorMessage = ''
  }

   _handleValue(e){
    this.dirty = true;
    const name = `on-date-${this.id}`
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

    if(!this.dirty){
      return true
    }
    if(this.validation.required && this.value === ''){
      this.errorMessage = 'El campo es requerido';
      return false;
    }
    if(this.validation.minDate && this.value < this.validation.minDate){
      this.errorMessage = `La fecha debe ser mayor a ${this.validation.minDate}`;
      return false;
    }
    if(this.validation.maxDate && this.value > this.validation.maxDate){
      this.errorMessage = `La fecha debe ser menor a ${this.validation.maxDate}`;
      return false
    }

    if(this.validation.onlyAfterToday && this.value < new Date().toISOString().split('T')[0]){
      this.errorMessage = `La fecha debe ser mayor a hoy`;
      return false
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
        type="date"
        ?disabled=${this.disabled} 
        @change=${this._handleValue} 
        .value=${this.value}
        .min=${
          this.validation.onlyAfterToday ? 
          new Date().toISOString().split('T')[0] :
          this.validation.minDate
        }
        .max=${this.validation.maxDate}
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

customElements.define('input-date', InputDateAppComponent);
