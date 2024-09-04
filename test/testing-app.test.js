import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/TestingApp.js';

const MOCKS_USERS = [
  {
    id: 1,
    codigo: {
      value: '001',
      valid: false
    },
    nombre: {
      value: 'Juan',
      valid: false
    },
    apellidos: {
      value: 'Pérez',
      valid: false
    },
    typeClient: {
      value: 'Regular',
      valid: false
    },
    correo: {
      value: 'juan.perez@example.com',
      valid: false
    },
    bornDate: {
      value: '1990-05-20',
      valid: false
    },
    estadocivil: {
      value: 'Soltero',
      valid: false
    },
    acepto: {
      value: false,
      valid: false
    }
  },
  {
    id: 2,
    codigo: {
      value: '002',
      valid: false
    },
    nombre: {
      value: 'Ana',
      valid: false
    },
    apellidos: {
      value: 'Martinez',
      valid: false
    },
    typeClient: {
      value: 'VIP',
      valid: false
    },
    correo: {
      value: 'ana.martinez@example.com',
      valid: false
    },
    bornDate: {
      value: '1984-11-30',
      valid: false
    },
    estadocivil: {
      value: 'Casado',
      valid: false
    },
    acepto: {
      value: false,
      valid: false
    }
  },
  {
    id: 3,
    codigo: {
      value: '003',
      valid: false
    },
    nombre: {
      value: 'Luis',
      valid: false
    },
    apellidos: {
      value: 'Gomez',
      valid: false
    },
    typeClient: {
      value: 'Frecuente',
      valid: false
    },
    correo: {
      value: 'luis.gomez@example.com',
      valid: false
    },
    bornDate: {
      value: '1975-09-15',
      valid: false
    },
    estadocivil: {
      value: 'Divorciado',
      valid: false
    },
    acepto: {
      value: false,
      valid: false
    }
  },
  {
    id: 4,
    codigo: {
      value: '004',
      valid: false
    },
    nombre: {
      value: 'Sofía',
      valid: false
    },
    apellidos: {
      value: 'Lopez',
      valid: false
    },
    typeClient: {
      value: 'Ocasional',
      valid: false
    },
    correo: {
      value: 'sofia.lopez@example.com',
      valid: false
    },
    bornDate: {
      value: '1989-03-05',
      valid: false
    },
    estadocivil: {
      value: 'Viudo',
      valid: false
    },
    acepto: {
      value: false,
      valid: false
    }
  }
]

describe('App Test Incializa comportamientos básicos', () => {
  let component;
  let form;
  let title;

  beforeEach(async () => {
    component = await fixture(html`
      <testing-app
      .clients=${[ ...MOCKS_USERS]}>
      </testing-app>
    `);
    form = component.shadowRoot.querySelector('form');
    title = component.shadowRoot.querySelector('h2');
  });

  it('Tiene un formulario', async () => {
    await component.updateComplete;
    expect(form).to.exist;
    expect(form).to.be.an.instanceOf(HTMLFormElement);
    expect(title).to.exist;
    expect(title.textContent.trim()).to.equal('Registro de Clientes');
  });
})

describe('Formulario Recibe inputs y reacciona correctamente', () => {
  let component;
  let form;

  beforeEach(async () => {
    component = await fixture(html`
      <testing-app
      .clients=${[ ...MOCKS_USERS]}>
      </testing-app>
    `);

    form = component.querySelector('form');

  });

  function setValue(selector, value, type) {
    return new Promise((resolve, reject) => {
      const input = component.shadowRoot.querySelector(selector);
      if(input){
        input.value = value;
        // input.dispatchEvent(new CustomEvent('change'))
        // input.dispatchEvent(new CustomEvent('blur'))
        input.dispatchEvent(new CustomEvent(type, {
          detail: {
            value: value,
            valid: true
          }
        }, {
          bubbles: true,
          composed: true
        }));
        resolve(true);
      } else {
        console.error('🔥 No se encontro el selector: ', selector);
        reject(false);
      }
     
    })
  }

  it('Envio de Formulario Correcto con Datos Correctos', async () => {
    await setValue('input-number', '005', 'on-input-codigo');
    await setValue('input-text[name="nombre"]', 'Carlos', 'on-input-nombre');
    await setValue('input-text[name="apellidos"]', 'Ramirez', 'on-input-apellidos');
    await setValue('input-text[name="correo"]', 'mail@mail.com', 'on-input-correo')
    await setValue('input-radio[name="typeClient"]', 'int', 'on-radio-typeClient');
    await setValue('input-date[name="bornDate"]', '1990-05-20', 'on-date-bornDate');
    await setValue('select-input[id="estadocivil"]', 'casado', 'on-select-estadocivil');
    await setValue('input-checkbox[name="acepto"]', true, 'on-checked-acepto');
    const buttonSend = component.shadowRoot.querySelector('button.send');
    //se espera que el boton se habilite ya que los campos tienen data correcta 
    expect(buttonSend.disabled).to.be.false;
    buttonSend.click();
    await component.updateComplete;
    //se Valida que el nuevo cliente se haya agregado a la lista
    expect(component.clients).to.be.an('array').lengthOf(5);
    //se valida que el nuevo cliente tenga los datos correctos
    expect(component.clients[4]).to.deep.equal({
      id: 5,
      codigo: {
        value: '005',
        valid: true
      },
      nombre: {
        value: 'Carlos',
        valid: true
      },
      apellidos: {
        value: 'Ramirez',
        valid: true
      },
      typeClient: {
        value: 'int',
        valid: true
      },
      correo: { 
        value: 'mail@mail.com',
        valid: true
      },
      bornDate: {
        value: '1990-05-20',
        valid: true
      },
      estadocivil: {
        value: 'casado',
        valid: true
      },
      acepto: {
        value: true,
        valid: true
      }
    });
  })
})

describe('Renderizado de Usuarios Registrados', () => {

  // let componentForm;
  // let userList;

  // beforeEach(async () => {
  //   userList = MOCKS_USERS
  //   componentForm = await fixture(html`
  //     <testing-app
  //     .clients=${userList}>
  //     </testing-app>
  //   `);
  // })

  it('Al dar click al boton de Ver Clientes se renderiza la lista de clientes', async () => {

    const componentForm = await fixture(html`
      <testing-app
      .clients=${[...MOCKS_USERS]}>
      </testing-app>
    `);

    expect(componentForm).to.exist;
    const buttonViewClients = componentForm.shadowRoot.querySelector('button.change');
    buttonViewClients.click();
    await componentForm.updateComplete;
    
    const componentListClients = await fixture(html`
      <client-list
      .clients=${[...MOCKS_USERS]}>
    </client-list>
    `);

    expect(componentListClients).to.exist;
    const title = componentListClients.shadowRoot.querySelector('.clients h2');
    expect(title.textContent.trim()).to.equal('Lista de Clientes');
  })

  it('Al dar click en eliminar cliente este es eliminado', async () => {
    const USERS = MOCKS_USERS
    const componentForm = await fixture(html`
      <testing-app
      .clients=${USERS}>
      </testing-app>
    `);

    const componentListClients = await fixture(html`
      <client-list
        .clients=${USERS}>
      </client-list>
    `);

    expect(componentForm).to.exist;
    expect(componentListClients).to.exist;

    const buttonViewClients = componentForm.shadowRoot.querySelector('button.change');
    buttonViewClients.click();

    console.log('✅ buttonViewClients = ', buttonViewClients)
    
    await componentForm.updateComplete;

    expect(componentForm.clients).to.be.an('array').lengthOf(4);

    const firstLiBTNremove = componentListClients.shadowRoot.querySelector('.clients-list li:first-child button');
    console.log('✅ firstLiBTNremove = ', firstLiBTNremove)
    firstLiBTNremove.click();
    
    componentListClients.dispatchEvent(new CustomEvent('on-remove-client', {
      detail: 1
    }, {
      bubbles: true,
      composed: true
    }))
   
    await componentListClients.updateComplete;
    await componentForm.updateComplete;
    expect(componentListClients.clients).to.be.an('array').lengthOf(3);
  })

  // it('Al dar click en eliminar cliente este es eliminado', async () => {

  //   const buttonViewClients = componentForm.shadowRoot.querySelector('button.change');
  //   buttonViewClients.click();
  //   await componentForm.updateComplete;

  //   //const initialClientCount = userList.length; // Debería ser 4 basado en MOCKS_USERS
  //   // console.log('✅ initialClientCount = ', initialClientCount)
  //   // const clientToRemove = userList[0].id; // ID del primer cliente
  //   // const componentListClients = await fixture(html`
  //   //   <client-list .clients=${userList}></client-list>
  //   // `);
  //  // await componentListClients.updateComplete;
  
  //   // Disparar el evento de eliminación manualmente
  //   componentListClients.dispatchEvent(new CustomEvent('on-remove-client', {
  //     detail: clientToRemove,
  //     bubbles: true, 
  //     composed: true
  //   }));
  
  //   // Esperar a que los cambios se procesen
  //   //await componentListClients.updateComplete;
  //   await componentForm.updateComplete;
  
  //   // Verificar que el número de clientes ha disminuido
  //   console.log('✅ componentListClients.clients.length = ', componentForm.clients.length)
  //   expect(componentForm.clients.length).to.equal(initialClientCount - 1);
  // });


})
