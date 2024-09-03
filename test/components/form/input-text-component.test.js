import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../../src/components/form/input-text-component/input-text-app-component';

describe('input-text Incializa comportamientos básicos', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {

    function handleInputTest(event) {
      return event;
    }

    component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}
        @on-input-nombre=${handleInputTest}>
      </input-text>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('Estado inicial cargado', async () => {
    expect(component.id).to.equal('nombre');
    expect(component.name).to.equal('nombre');
    expect(component.disabled).to.be.false;
  });

  it('Validación de campo requerido', async () => {
    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });
})

describe('input-text Sistema de Validaciones Exitosas', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true, minLength: 3, maxLength: 10 }}
        @on-input-nombre=${handleInputTest}>
      </input-text>
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
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml).to.be.null;
  });

  it('Validación exitosa de campo con longitud máxima', async () => {
    inputHtml.value = '1234567890';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml).to.be.null;
  });
})

describe('input-text Sistema de Validaciones con Error', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true, minLength: 3, maxLength: 10 }}
        @on-input-nombre=${handleInputTest}>
      </input-text>
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
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo debe tener al menos 3 caracteres');
  });

  it('Validación exitosa de campo con longitud máxima', async () => {
    inputHtml.value = '12345678901';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo debe tener menos de 10 caracteres');
  });
})

describe('input-text Sistema de Validaciones con Expresiones Regulares', () => {
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
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true, pattern: expRegularPass }}
        @on-input-nombre=${handleInputTest}>
      </input-text>
    `);
    inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = 'Aa1234f?!';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml).to.be.null;
  });

  it('Error en Password mediante expresion regular', async () => {
    component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true, pattern: expRegularPass }}
        @on-input-nombre=${handleInputTest}>
      </input-text>
    `);
    inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = '12345';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo no cumple con el formato requerido')
  });

  it('Error en Email mediante expresion regular', async () => {
    component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true, pattern: expRegularEmail }}
        @on-input-nombre=${handleInputTest}>
      </input-text>
    `);
    inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = 'mailArrobagmail.com';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
      
    await component.updateComplete;

    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo no cumple con el formato requerido');
  });
})

describe('input-text Envia los Eventos al Componente Padre', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {

    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}
        @on-input-nombre=${handleInputTest}>
      </input-text>
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
    inputHtml.dispatchEvent(new Event('blur'));
  });

  it('El Evento Custom retorna valid=false en caso de error', async () => {

    component.addEventListener('on-input-nombre', (e) => {
      expect(e.detail.value).to.equal('');
      expect(e.detail.valid).to.equal(false);
    });

    inputHtml.value = ' ';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
  })
})

describe('input-text Recibe el evento clear del Componente Padre y reinicia su estado', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}
        .clear=${false}
        @on-input-nombre=${handleInputTest}>
      </input-text>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('El Evento del padre llega a Input-Text', async () => {
    const valueToSet = 'Jose Pepe'

    component.addEventListener('on-input-nombre', async (e) => {
      //Padre recibe el valid y value correctos
      expect(e.detail.value).to.equal(valueToSet);
      expect(e.detail.valid).to.equal(true);
      //Se valida estado actual del input-text
      expect(component.value).to.equal(valueToSet);
      expect(component.id).to.equal('nombre');
      //padre ordena el clear
      component.clear = true;
      await component.updateComplete;
      //validamos que el Evento clear llego y que cambio el value a ''
      expect(component.clear).to.be.true;
      expect(component.value).to.equal('');
    });

    inputHtml.value = valueToSet;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
  })
})

describe('Renderizados correctos de Elementos', () => {

  it('El label muestra el * al ser requerido', async () => {
    const component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}>
      </input-text>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Nombre *');
  });

  it('El label NO muestra el * de requerido', async () => {
    const component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: false }}>
      </input-text>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Nombre');
  });

  it('En caso de Error se renderiza el mensaje', async () => {
    const component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}>
      </input-text>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = '';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });

  it('En caso de Error el label es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}>
      </input-text>
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
      <input-text
        id="nombre"
        name="nombre"
        label="Nombre"
        .validation=${{ required: true }}>
      </input-text>
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
