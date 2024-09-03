import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../../src/components/form/select-component/select-app-component.js';

describe('select-input Incializa comportamientos básicos', () => {
  let component;
  let inputHtml;
  const optionsCivilState = [
    { value: 'soltero', label: 'Soltero' },
    { value: 'casado', label: 'Casado' },
    { value: 'divorciado', label: 'Divorciado' },
    { value: 'viudo', label: 'Viudo' }
  ];

  beforeEach(async () => {

    component = await fixture(html`
      <select-input
        id="estadocivil"
        name="estadocivil"
        label="Estado Civil"
        .validation=${{required: true}}
        placeholder="Seleccione un estado civil"
        .options=${optionsCivilState}>
      </select-input>
    `);
    inputHtml = component.shadowRoot.querySelector('select');
  });

  it('Estado inicial cargado', async () => {
    expect(component.id).to.equal('estadocivil');
    expect(component.name).to.equal('estadocivil');
    expect(component.options).to.lengthOf(4);
    expect(component.validation.required).to.be.true;
    expect(component.disabled).to.be.false;
  });

  it('Validación de campo requerido', async () => {
    //inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });
})

describe('select-input Envia los Eventos al Componente Padre', () => {
  let component;
  let inputHtml;
  const optionsCivilState = [
    { value: 'soltero', label: 'Soltero' },
    { value: 'casado', label: 'Casado' },
    { value: 'divorciado', label: 'Divorciado' },
    { value: 'viudo', label: 'Viudo' }
  ];

  beforeEach(async () => {

    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <select-input
        id="estadocivil"
        name="estadocivil"
        label="Estado Civil"
        .validation=${{required: true}}
        placeholder="Seleccione un estado civil"
        .options=${optionsCivilState}
        @on-select-estadocivil=${handleInputTest}>
      </select-input>

    `);
    inputHtml = component.shadowRoot.querySelector('select');
  });

  it('El Evento Custom retorna el Valor Seleccionado', async () => {
    const valueToSet = optionsCivilState[1].value;

    component.addEventListener('on-select-estadocivil', (e) => {
      expect(e.detail.value).to.equal(valueToSet);
      expect(e.detail.valid).to.equal(true);
    });

    inputHtml.value = valueToSet;
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
  });

  it('El Evento Custom retorna valid=false en caso de error', async () => {

    component.addEventListener('on-select-estadocivil', (e) => {
      expect(e.detail.value).to.equal('');
      expect(e.detail.valid).to.equal(false);
    });

    inputHtml.value = ' ';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
  })
})

describe('select-input Recibe el evento clear del Componente Padre y reinicia su estado', () => {
  let component;
  let inputHtml;
  const optionsCivilState = [
    { value: 'soltero', label: 'Soltero' },
    { value: 'casado', label: 'Casado' },
    { value: 'divorciado', label: 'Divorciado' },
    { value: 'viudo', label: 'Viudo' }
  ];

  beforeEach(async () => {
    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <select-input
        id="estadocivil"
        name="estadocivil"
        label="Estado Civil"
        .validation=${{required: true}}
        placeholder="Seleccione un estado civil"
        .options=${optionsCivilState}
        @on-select-estadocivil=${handleInputTest}>
      </select-input>
    `);
    inputHtml = component.shadowRoot.querySelector('select');
  });

  it('El Evento del padre llega a Input-Text', async () => {
    const valueToSet = optionsCivilState[3].value;

    component.addEventListener('on-select-estadocivil', async (e) => {
      //Padre recibe el valid y value correctos
      expect(e.detail.value).to.equal(valueToSet);
      expect(e.detail.valid).to.equal(true);
      //Se valida estado actual del select-input
      expect(component.value).to.equal(valueToSet);
      expect(component.id).to.equal('estadocivil');
      //padre ordena el clear
      component.clear = true;
      await component.updateComplete;
      //validamos que el Evento clear llego y que cambio el value a ''
      expect(component.clear).to.be.true;
      expect(component.value).to.equal('');
    });

    inputHtml.value = valueToSet;
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
  })
})

describe('Renderizados correctos de Elementos', () => {

  const optionsCivilState = [
    { value: 'soltero', label: 'Soltero' },
    { value: 'casado', label: 'Casado' },
    { value: 'divorciado', label: 'Divorciado' },
    { value: 'viudo', label: 'Viudo' }
  ];

  it('El label muestra el * al ser requerido', async () => {
    const component = await fixture(html`
      <select-input
        id="estadocivil"
        name="estadocivil"
        label="Estado Civil"
        .validation=${{required: true}}
        placeholder="Seleccione un estado civil"
        .options=${optionsCivilState}>
      </select-input>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Estado Civil *');
  });

  it('El label NO muestra el * de requerido', async () => {
    const component = await fixture(html`
      <select-input
        id="estadocivil"
        name="estadocivil"
        label="Estado Civil"
        .validation=${{required: false}}
        placeholder="Seleccione un estado civil"
        .options=${optionsCivilState}>
      </select-input>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Estado Civil');
  });

  it('En caso de Error se renderiza el mensaje', async () => {
    const component = await fixture(html`
      <select-input
        id="estadocivil"
        name="estadocivil"
        label="Estado Civil"
        .validation=${{required: true}}
        placeholder="Seleccione un estado civil"
        .options=${optionsCivilState}>
      </select-input>
    `);
    const inputHtml = component.shadowRoot.querySelector('select');

    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });

  it('En caso de Error el label es de Color Rojo', async () => {
    const component = await fixture(html`
      <select-input
        id="estadocivil"
        name="estadocivil"
        label="Estado Civil"
        .validation=${{required: true}}
        placeholder="Seleccione un estado civil"
        .options=${optionsCivilState}>
      </select-input>
    `);
    const inputHtml = component.shadowRoot.querySelector('select');
  
    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const labelWithError = component.shadowRoot.querySelector('label');
    expect(labelWithError.classList['1']).to.equal('error');
  });

  it('En caso de Error el borde del input es de Color Rojo', async () => {
    const component = await fixture(html`
      <select-input
        id="estadocivil"
        name="estadocivil"
        label="Estado Civil"
        .validation=${{required: true}}
        placeholder="Seleccione un estado civil"
        .options=${optionsCivilState}>
      </select-input>
    `);

    const inputHtml = component.shadowRoot.querySelector('select');
  
    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('change'));
    inputHtml.dispatchEvent(new Event('blur'));
    
    await component.updateComplete;
    const inputWithError = component.shadowRoot.querySelector('select');
    expect(inputWithError.classList['0']).to.equal('invalid');
  });
})
