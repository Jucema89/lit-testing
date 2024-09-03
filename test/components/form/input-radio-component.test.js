import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../../src/components/form/input-radio-component/input-radio-app-component.js';

describe('input-radio Incializa comportamientos básicos', () => {
  let component;
  let inputHtml;
  const optionsClientType = [
    {label: 'Nacional', value: 'nal'}, 
    { label: 'Internacional', value: 'int'}
  ];

  beforeEach(async () => {
    component = await fixture(html`
      <input-radio
        id="typeClient"
        name="typeClient"
        label="Tipo de Cliente"
        .options=${optionsClientType}  
        .validation=${{ required: true }}>
      </input-radio>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('Estado inicial cargado', async () => {
    expect(component.id).to.equal('typeClient');
    expect(component.name).to.equal('typeClient');
    expect(component.checkedOption).to.equal('');
    expect(component.disabled).to.be.false;
  })
})

describe('input-radio Sistema de Validacion Exitosa', () => {
  let component;
  let inputHtml;
  const optionsClientType = [
    {label: 'Nacional', value: 'nal'}, 
    { label: 'Internacional', value: 'int'}
  ];

  beforeEach(async () => {
    component = await fixture(html`
      <input-radio
        id="typeClient"
        name="typeClient"
        label="Tipo de Cliente"
        .options=${optionsClientType}  
        .validation=${{ required: true }}>
      </input-radio>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('Error por campo requerido', async () => {
    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });

  it('Validacion Exitosa de campo requerido', async () => {
    inputHtml.value = 'nal';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml).to.be.null;
  });
})

describe('input-radio Envia los Eventos al Componente Padre', () => {
  let component;
  let inputHtml;
  const optionsClientType = [
    {label: 'Nacional', value: 'nal'}, 
    { label: 'Internacional', value: 'int'}
  ];

  beforeEach(async () => {

    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <input-radio
        id="typeClient"
        name="typeClient"
        label="Tipo de Cliente"
        .options=${optionsClientType}  
        .validation=${{ required: true }}
        @on-radio-typeClient=${handleInputTest}>
      </input-radio>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('El Evento Custom retorna el Valor ingresado al input', async () => {

    component.addEventListener('on-radio-typeClient', (e) => {
      expect(e.detail.value).to.equal('nal');
      expect(e.detail.valid).to.be.true;
    });

    inputHtml.value = 'nal';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
  });

  it('El Evento Custom retorna valid=false en caso de error', async () => {
    component.addEventListener('on-radio-typeClient', (e) => {
      expect(e.detail.value).to.equal('');
      expect(e.detail.valid).to.be.false;
    });

    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
  })
});

describe('input-radio Recibe el evento clear del Componente Padre y reinicia su estado', () => {
  let component;
  let inputHtml;
  const optionsClientType = [
    {label: 'Nacional', value: 'nal'}, 
    { label: 'Internacional', value: 'int'}
  ];

  beforeEach(async () => {
    function handleInputTest(event) {
      return event;
    }

    component = await fixture(html`
      <input-radio
        id="typeClient"
        name="typeClient"
        label="Tipo de Cliente"
        .options=${optionsClientType}  
        .validation=${{ required: true }}
        @on-radio-typeClient=${handleInputTest}>
      </input-radio>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('El Evento del padre llega a Input-radio', async () => {

      inputHtml.value = 'nal';
      inputHtml.dispatchEvent(new Event('change'));
      // Verificar que el input está checked
      expect(component.checkedOption).to.equal('nal');
  
      // El padre envia el evento clear
      component.clear = true;
      await component.updateComplete;
  
      // Verifica que clear es true y que checked ha cambiado a false
      expect(component.clear).to.be.true;
      expect(component.checkedOption).to.equal('');
  });
})

describe('Renderizados correctos de Elementos', () => {
  const optionsClientType = [
    {label: 'Nacional', value: 'nal'}, 
    { label: 'Internacional', value: 'int'}
  ];

  it('El label muestra el * al ser requerido', async () => {
    const component = await fixture(html`
      <input-radio
        id="typeClient"
        name="typeClient"
        label="Tipo de Cliente"
        .options=${optionsClientType}  
        .validation=${{ required: true }}>
      </input-radio>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Tipo de Cliente *');
  });

  it('El label NO muestra el * de requerido', async () => {
    const component = await fixture(html`
      <input-radio
        id="typeClient"
        name="typeClient"
        label="Tipo de Cliente"
        .options=${optionsClientType}  
        .validation=${{ required: false }}>
      </input-radio>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Tipo de Cliente');
  });

  it('En caso de Error se renderiza el mensaje', async () => {
    const component = await fixture(html`
      <input-radio
        id="typeClient"
        name="typeClient"
        label="Tipo de Cliente"
        .options=${optionsClientType}  
        .validation=${{ required: true }}>
      </input-radio>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');
    
    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });

  it('En caso de Error el label es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-radio
        id="typeClient"
        name="typeClient"
        label="Tipo de Cliente"
        .options=${optionsClientType}  
        .validation=${{ required: true }}>
      </input-radio>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');
  
    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const labelWithError = component.shadowRoot.querySelector('label');
    expect(labelWithError.classList['1']).to.equal('error');
  });

  it('En caso de Error el borde del input es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-radio
        id="typeClient"
        name="typeClient"
        label="Tipo de Cliente"
        .options=${optionsClientType}  
        .validation=${{ required: true }}>
      </input-radio>
    `);

    const inputHtml = component.shadowRoot.querySelector('input');
  
    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
    
    await component.updateComplete;
    const inputWithError = component.shadowRoot.querySelector('input');
    expect(inputWithError.classList['0']).to.equal('invalid');
  });
})
