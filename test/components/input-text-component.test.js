import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../src/components/input-text-component/input-text-app-component.js';

describe('input-text-app Incializa comportamientos básicos', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {

    function handleInputTest(event) {
      return event;
    }

    component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}
        @on-input-nombre=${handleInputTest}>
      </input-text-app>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('Estado inicial cargado', async () => {
    expect(component.id).to.equal('nombre');
    expect(component.name).to.equal('nombre');
    expect(component.disabled).to.be.false;
    expect(component._dirty).to.be.false;
    expect(component._runValidate).to.be.false;
    expect(component._errorMessage).to.equal('');
  });

  it('Validación de campo requerido', async () => {
    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    expect(component._errorMessage).to.equal('El campo es requerido');
  });
})

describe('input-text-app Sistema de Validaciones Exitosas', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true, minLength: 3, maxLength: 10 }}
        @on-input-nombre=${handleInputTest}>
      </input-text-app>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  function handleInputTest(event) {
    return event.detail;
  }

  it('Validación exitosa de campo con longitud mínima', async () => {
    inputHtml.value = '123';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    
    expect(component._errorMessage).to.equal('');
  });

  it('Validación exitosa de campo con longitud máxima', async () => {
    inputHtml.value = '1234567890';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    expect(component._errorMessage).to.equal('');
  });
})

describe('input-text-app Sistema de Validaciones con Error', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true, minLength: 3, maxLength: 10 }}
        @on-input-nombre=${handleInputTest}>
      </input-text-app>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  function handleInputTest(event) {
    return event.detail;
  }

  it('Error en Validación  de campo con longitud mínima', async () => {
    inputHtml.value = '12';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    expect(component._errorMessage).to.equal('El campo debe tener al menos 3 caracteres');
  });

  it('Validación exitosa de campo con longitud máxima', async () => {
    inputHtml.value = '12345678901';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    expect(component._errorMessage).to.equal('El campo debe tener menos de 10 caracteres');
  });
})

describe('input-text-app Sistema de Validaciones con Expresiones Regulares', () => {
  let component;
  let inputHtml;

  //expresion regular que valide que el texto tenga por lo menos 1 letra minuscula, 1 letra mayuscula, 1 numero del 1 al 9, 1 caracter especial y una longitud minima de 8 caracteres
  const expRegularPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W)(?=.*\d)[a-zA-Z\W\d]{8,}$/;
  //Expresion regular que valide un correo electronico
  const expRegularEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  function handleInputTest(event) {
    return event.detail;
  }

  it('Validación de Password exitoso mediante expresion regular', async () => {
    component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true, pattern: expRegularPass }}
        @on-input-nombre=${handleInputTest}>
      </input-text-app>
    `);
    inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = 'Aa1234f?!';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    expect(component._errorMessage).to.equal('');
  });

  it('Error en Password mediante expresion regular', async () => {
    component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true, pattern: expRegularPass }}
        @on-input-nombre=${handleInputTest}>
      </input-text-app>
    `);
    inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = '12345';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    expect(component._errorMessage).to.equal('El campo no cumple con el formato requerido');
  });

  it('Error en Email mediante expresion regular', async () => {
    component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true, pattern: expRegularEmail }}
        @on-input-nombre=${handleInputTest}>
      </input-text-app>
    `);
    inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = 'mailArrobagmail.com';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
      
    await component.updateComplete;

    expect(component._errorMessage).to.equal('El campo no cumple con el formato requerido');
  });
})

describe('input-text-app Envia los Eventos al Componente Padre', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {

    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}
        @on-input-nombre=${handleInputTest}>
      </input-text-app>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('El Evento Custom retorna el Valor ingresado al input', async () => {
    const valueToSet = 'Aa1234f?!'

    component.addEventListener('on-input-nombre', (e) => {
      expect(e.detail.value).to.equal(valueToSet);
      expect(e.detail.valid).to.equal(true);
    });

    inputHtml.value = valueToSet;
    inputHtml.dispatchEvent(new Event('input'));

    await new Promise(resolve => setTimeout(resolve, 1000));

  });

  it('El Evento Custom retorna valid=false en caso de error', async () => {

    component.addEventListener('on-input-nombre', (e) => {
      expect(e.detail.value).to.equal('');
      expect(e.detail.valid).to.equal(false);
    });

    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
})

describe('Renderizados correctos de Elementos', () => {

  it('El label muestra el * al ser requerido', async () => {
    const component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}>
      </input-text-app>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Nombre *');
  });

  it('El label NO muestra el * de requerido', async () => {
    const component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: false }}>
      </input-text-app>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Nombre');
  });

  it('En caso de Error se renderiza el mensaje', async () => {
    const component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}>
      </input-text-app>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent.trim()).to.equal('⛔ El campo es requerido');
  });

  it('En caso de Error el label es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}>
      </input-text-app>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');
  
    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const labelWithError = component.shadowRoot.querySelector('label');
    expect(labelWithError.classList['1']).to.equal('error');
  });

  it('En caso de Error el borde del input es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-text-app
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}>
      </input-text-app>
    `);

    const inputHtml = component.shadowRoot.querySelector('input');
  
    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    
    await component.updateComplete;
    const inputWithError = component.shadowRoot.querySelector('input');
    expect(inputWithError.classList['0']).to.equal('invalid');
  });



})
