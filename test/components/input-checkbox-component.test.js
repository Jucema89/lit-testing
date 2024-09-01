import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../src/components/form/input-checkbox-component/input-checkbox-app-component.js';

describe('input-checkbox Incializa comportamientos básicos', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {

    function handleInputTest(event) {
      return event;
    }

    component = await fixture(html`
      <input-checkbox
        id="acepto"
        name="acepto"
        label="Acepto los terminos y condiciones"
        .validation=${{ required: true }}
        @on-input-acepto=${handleInputTest}>
      </input-checkbox>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('Estado inicial cargado', async () => {
    expect(component.id).to.equal('acepto');
    expect(component.name).to.equal('acepto');
    expect(component.checked).to.be.false;
    expect(component.disabled).to.be.false;
  })
})

describe('input-checkbox Sistema de Validacion Exitosa', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    component = await fixture(html`
      <input-checkbox
        id="acepto"
        name="acepto"
        label="Acepto los terminos y condiciones"
        .validation=${{ required: true }}
        @on-input-acepto=${handleInputTest}>
      </input-checkbox>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  function handleInputTest(event) {
    return event.detail;
  }

  it('Error por campo requerido', async () => {
    //se simula el evento de input 2 veces, para marcar y desmarcar el checkbox
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('change'));
    //se simula la salida el checkbox para que se ejecute la validacion
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });

  it('Validacion Exitosa de campo requerido', async () => {
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml).to.be.null;
  });
})

describe('input-checkbox Envia los Eventos al Componente Padre', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {

    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <input-checkbox
        id="acepto"
        name="acepto"
        label="Acepto los terminos y condiciones"
        .validation=${{ required: true }}
        @on-input-acepto=${handleInputTest}>
      </input-checkbox>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('El Evento Custom retorna el Valor ingresado al input', async () => {

    component.addEventListener('on-input-acepto', (e) => {
      expect(e.detail.value).to.be.true;
      expect(e.detail.valid).to.be.true;
    });

    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
  });

  it('El Evento Custom retorna valid=false en caso de error', async () => {

    component.addEventListener('on-input-acepto', (e) => {
      expect(e.detail.value).to.be.false;
      expect(e.detail.valid).to.be.false;
    });

    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
  })
})

describe('input-checkbox Recibe el evento clear del Componente Padre y reinicia su estado', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <input-checkbox
        id="acepto"
        name="acepto"
        label="Acepto los terminos y condiciones"
        .validation=${{ required: true }}
        .clear=${false}
        @on-input-acepto=${handleInputTest}>
      </input-checkbox>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('El Evento del padre llega a Input-checkbox', async () => {

    component.addEventListener('on-input-acepto', async (e) => {
      //Padre recibe el valid y value correctos
      expect(e.detail.value).to.be.true;
      expect(e.detail.valid).to.be.true;
      //Se valida estado actual del input-checkbox
      expect(component.checked).to.be.true;
      expect(component.id).to.equal('acepto');
      //padre ordena el clear
      inputHtml.clear = true;
      await component.updateComplete;
      //validamos que el Evento clear llego y que cambio el value a ''
      expect(component.clear).to.be.true;
      expect(component.checked).to.be.false;
    });

    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
  })
})

describe('Renderizados correctos de Elementos', () => {

  it('El label muestra el * al ser requerido', async () => {
    const component = await fixture(html`
      <input-checkbox
        id="acepto"
        name="acepto"
        label="Acepto los terminos y condiciones"
        .validation=${{ required: true }}>
      </input-checkbox>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Acepto los terminos y condiciones *');
  });

  it('El label NO muestra el * de requerido', async () => {
    const component = await fixture(html`
      <input-checkbox
        id="acepto"
        name="acepto"
        label="Acepto los terminos y condiciones"
        .validation=${{ required: false }}>
      </input-checkbox>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Acepto los terminos y condiciones');
  });

  it('En caso de Error se renderiza el mensaje', async () => {
    const component = await fixture(html`
      <input-checkbox
        id="acepto"
        name="acepto"
        label="Acepto los terminos y condiciones"
        .validation=${{ required: true }}>
      </input-checkbox>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');
    
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });

  it('En caso de Error el label es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-checkbox
        id="acepto"
        name="acepto"
        label="Acepto los terminos y condiciones"
        .validation=${{ required: true }}>
      </input-checkbox>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');
  
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const labelWithError = component.shadowRoot.querySelector('label');
    expect(labelWithError.classList['1']).to.equal('error');
  });

  it('En caso de Error el borde del input es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-checkbox
        id="acepto"
        name="acepto"
        label="Acepto los terminos y condiciones"
        .validation=${{ required: true }}>
      </input-checkbox>
    `);

    const inputHtml = component.shadowRoot.querySelector('input');
  
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('change'));
    
    inputHtml.dispatchEvent(new Event('blur'));
    
    await component.updateComplete;
    const inputWithError = component.shadowRoot.querySelector('input');
    expect(inputWithError.classList['0']).to.equal('invalid');
  });



})
