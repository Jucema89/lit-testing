import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../src/components/form/input-number-component/input-number-app-component';

describe('input-number Incializa comportamientos básicos', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {

    function handleInputTest(event) {
      return event;
    }

    component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        placeholder="01234"
        .validation=${{ required: true }}
        @on-input-codigo=${handleInputTest}>
      </input-number>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('Estado inicial cargado', async () => {
    expect(component.id).to.equal('codigo');
    expect(component.name).to.equal('codigo');
    expect(component.disabled).to.be.false;
    expect(component.placeholder).to.equal('01234');
  });

  it('Validación de campo requerido', async () => {
    inputHtml.value = 0;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });
})

describe('input-number Sistema de Validaciones Exitosas', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: true, minLength: 3, maxLength: 10 }}
        @on-input-codigo=${handleInputTest}>
      </input-number>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  function handleInputTest(event) {
    return event.detail;
  }

  it('Validación exitosa de campo con longitud mínima', async () => {
    inputHtml.value = 123;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml).to.be.null;
  });

  it('Validación exitosa de campo con longitud máxima', async () => {
    inputHtml.value = 1234567890;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml).to.be.null;
  });
})

describe('input-number Sistema de Validaciones con Error', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: true, minLength: 3, maxLength: 10 }}
        @on-input-codigo=${handleInputTest}>
      </input-number>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  function handleInputTest(event) {
    return event.detail;
  }

  it('Error en Validación  de campo con longitud mínima', async () => {
    inputHtml.value = 12;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo debe tener al menos 3 numeros');
  });

  it('Error en Validación de campo por ingresar letras', async () => {
    inputHtml.value = '12ab3';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo solo puede contener números');
  });

  it('Validación exitosa de campo con longitud máxima', async () => {
    inputHtml.value = 12345678901;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo debe tener menos de 10 numeros');
  });
})

describe('input-number Sistema de Validaciones con Expresiones Regulares', () => {
  let component;
  let inputHtml;
 
  //expresion regular que valida que el numero sea mayor a 2000
  const expRegNumbersTo2000 = /^[2-9]\d{3,}$/;

  function handleInputTest(event) {
    return event.detail;
  }

  it('Validación de Numeros Mayores a 2000 exitoso mediante expresion regular', async () => {
    component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: true, pattern: expRegNumbersTo2000 }}
        @on-input-codigo=${handleInputTest}>
      </input-number>
    `);
    inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = 2100;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml).to.be.null;
  });

  it('Error en Numeros Mayores a 2000 mediante expresion regular', async () => {
    component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: true, pattern: expRegNumbersTo2000 }}
        @on-input-codigo=${handleInputTest}>
      </input-number>
    `);
    inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = 1900;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;

    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El numero no cumple con el formato requerido')
  });
})

describe('input-number Envia los Eventos al Componente Padre', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {

    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: true }}
        @on-input-codigo=${handleInputTest}>
      </input-number>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('El Evento Custom retorna el Valor ingresado al input', async () => {
    const valueToSet = 123456

    component.addEventListener('on-input-codigo', (e) => {
      expect(e.detail.value).to.equal(valueToSet);
      expect(e.detail.valid).to.equal(true);
    })

    inputHtml.value = valueToSet;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
  });

  it('El Evento Custom retorna valid=false en caso de error', async () => {

    component.addEventListener('on-input-codigo', (e) => {
      expect(e.detail.value).to.equal(0);
      expect(e.detail.valid).to.equal(false);
    });

    inputHtml.value = 0;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
  })
})

describe('input-number Recibe el evento clear del Componente Padre y reinicia su estado', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: true }}
        .clear=${false}
        @on-input-codigo=${handleInputTest}>
      </input-number>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('El Evento del padre llega a Input-Text', async () => {
    const valueToSet = 2344

    component.addEventListener('on-input-codigo', async (e) => {
      //Padre recibe el valid y value correctos
      expect(e.detail.value).to.equal(valueToSet);
      expect(e.detail.valid).to.equal(true);
      //Se valida estado actual del input-number
      expect(component.value).to.equal(String(valueToSet));
      expect(component.id).to.equal('codigo');
      //padre ordena el clear
      component.clear = true;
      await component.updateComplete;
      //validamos que el Evento clear llego y que cambio el value a ''
      expect(component.clear).to.be.true;
      expect(component.value).to.equal('0');
    });

    inputHtml.value = valueToSet;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
  })
})

describe('Renderizados correctos de Elementos', () => {

  it('El label muestra el * al ser requerido', async () => {
    const component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: true }}>
      </input-number>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Codigo *');
  });

  it('El label NO muestra el * de requerido', async () => {
    const component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: false }}>
      </input-number>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Codigo');
  });

  it('En caso de Error se renderiza el mensaje', async () => {
    const component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: true }}>
      </input-number>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');

    inputHtml.value = 0;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });

  it('En caso de Error el label es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: true }}>
      </input-number>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');
  
    inputHtml.value = 0;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const labelWithError = component.shadowRoot.querySelector('label');
    expect(labelWithError.classList['1']).to.equal('error');
  });

  it('En caso de Error el borde del input es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-number
        id="codigo"
        name="codigo"
        label="Codigo"
        .validation=${{ required: true }}>
      </input-number>
    `);

    const inputHtml = component.shadowRoot.querySelector('input');
  
    inputHtml.value = 0;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    
    await component.updateComplete;
    const inputWithError = component.shadowRoot.querySelector('input');
    expect(inputWithError.classList['0']).to.equal('invalid');
  });
})
