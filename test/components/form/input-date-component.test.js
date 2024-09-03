import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../../src/components/form/input-date-component/input-date-app-component';

describe('input-date Incializa comportamientos básicos', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ required: true }}>
      </input-date>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('Estado inicial cargado y dia de Hoy como valor por defecto', () => {
    expect(component.id).to.equal('bornDate');
    expect(component.name).to.equal('bornDate');
    expect(component.disabled).to.be.false;
    expect(component.value).to.equal('');
  })
})

describe('input-date Sistema de Validacion Exitosa', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ required: true }}>
      </input-date>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('Error por campo requerido', async () => {
    inputHtml.dispatchEvent(new Event('input'));
    component.value = '';
    inputHtml.dispatchEvent(new Event('blur'));
    
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });

  it('Validacion Exitosa de campo requerido', async () => {
    inputHtml.dispatchEvent(new Event('input'));
    component.value = '2024-01-01';
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml).to.be.null;
  });
})

describe('input-date Sistema de Validacion de rangos de Fechas', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ 
          required: true, 
          minDate: '2010-10-10', 
          maxDate: '2010-10-20' 
        }}>
      </input-date>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('Error por fecha superior a la Estipulada como minima', async () => {
    
    inputHtml.value = '2010-10-05';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ La fecha debe ser mayor a 2010-10-10');
  });

  it('Error por fecha inferior a la Estipulada como maxima', async () => {
    inputHtml.value = '2010-10-25';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ La fecha debe ser menor a 2010-10-20');
  });
})

describe('input-date Sistema de Validacion de fechas mayor a Hoy', () => {
  let component;
  let inputHtml;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  beforeEach(async () => {
    component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ 
          required: true, 
          onlyAfterToday: true
        }}>
      </input-date>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('Error por fecha inferior a Hoy', async () => {

    inputHtml.value = yesterday;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ La fecha debe ser mayor a hoy');
  });

  it('Exito al ingresar Fecha superior a Hoy ', async () => {
    inputHtml.value = tomorrow;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml).to.be.null;
  });
})

describe('input-date Envia los Eventos al Componente Padre', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {

    function handleInputTest(event) {
      return event.detail;
    }

    component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ required: true, minDate: '2024-01-01' }}
        @on-date-bornDate=${handleInputTest}>
      </input-date>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('El Evento Custom retorna el Valor ingresado al input', async () => {
    const valueSet = '2024-01-02';
    component.addEventListener('on-date-bornDate', (e) => {
      expect(e.detail.value).to.equal(valueSet);
      expect(e.detail.valid).to.be.true;
    });

    inputHtml.value = valueSet;
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
  });

  it('El Evento Custom retorna valid=false en caso de error', async () => {
    const valueSet = '2023-12-01';
    inputHtml.value = valueSet;

    component.addEventListener('on-date-bornDate', (e) => {
      expect(e.detail.value).to.equal(valueSet);
      expect(e.detail.valid).to.be.false;
    });
   
    component.value = '';
    //inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('input')); 
    inputHtml.dispatchEvent(new Event('blur'));
    //await component.updateComplete;
  })
});

describe('input-date Recibe el evento clear del Componente Padre y reinicia su estado', () => {
  let component;
  let inputHtml;

  beforeEach(async () => {
    function handleInputTest(event) {
      return event;
    }

    component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ required: true }}
        .clear=${false}
        @on-date-bornDate=${handleInputTest}>
      </input-date>
    `);
    inputHtml = component.shadowRoot.querySelector('input');
  });

  it('El Evento del padre llega a Input-date', async () => {

    inputHtml.value = '2024-01-01';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    expect(component.value).to.equal('2024-01-01');
    // El padre envia el evento clear
    component.clear = true;
    await component.updateComplete;

    expect(component.clear).to.be.true;
    expect(component.value).to.equal('');
  });
})

describe('Renderizados correctos de Elementos', () => {

  it('El label muestra el * al ser requerido', async () => {
    const component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ required: true }}>
      </input-date>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Fecha de nacimiento *');
  });

  it('El label NO muestra el * de requerido', async () => {
    const component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ required: false }}>
      </input-date>
    `);
    const labelHtml = component.shadowRoot.querySelector('.label');
    expect(labelHtml.textContent.trim()).to.equal('Fecha de nacimiento');
  });

  it('En caso de Error se renderiza el mensaje', async () => {
    const component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ required: true }}>
      </input-date>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');
    component.value = '';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const messageErrorHtml = component.shadowRoot.querySelector('.message-error');
    expect(messageErrorHtml.textContent).to.equal('⛔ El campo es requerido');
  });

  it('En caso de Error el label es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ required: true }}>
      </input-date>
    `);
    const inputHtml = component.shadowRoot.querySelector('input');
    
    component.value = '';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));

    await component.updateComplete;
    const labelWithError = component.shadowRoot.querySelector('label');
    expect(labelWithError.classList['1']).to.equal('error');
  });

  it('En caso de Error el borde del input es de Color Rojo', async () => {
    const component = await fixture(html`
      <input-date
        id="bornDate"
        name="bornDate"
        label="Fecha de nacimiento"
        .validation=${{ required: true }}>
      </input-date>
    `);

    const inputHtml = component.shadowRoot.querySelector('input');
    
    component.value = '';
    inputHtml.dispatchEvent(new Event('input'));
    inputHtml.dispatchEvent(new Event('blur'));
    
    await component.updateComplete;
    const inputWithError = component.shadowRoot.querySelector('input');
    expect(inputWithError.classList['0']).to.equal('invalid');
  });
})
