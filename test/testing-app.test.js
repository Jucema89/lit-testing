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
})

//   it('Estado inicial cargado', async () => {
//     await component.updateComplete;
//     expect(component.clients).to.be.an('array').lengthOf(4);
//     expect(component.formData).to.deep.equal({
//       codigo: {
//         value: '',
//         valid: false
//       },
//       nombre: {
//         value: '',
//         valid: false
//       },
//       apellidos: {
//         value: '',
//         valid: false
//       },
//       typeClient: {
//         value: '',
//         valid: false
//       },
//       correo: {
//         value: '',
//         valid: false
//       },
//       bornDate: {
//         value: '',
//         valid: false
//       },
//       estadocivil: {
//         value: '',
//         valid: false
//       },
//       acepto: {
//         value: false,
//         valid: false
//       }
//     });
//     expect(form).to.exist;
//     expect(title.textContent.trim()).to.equal('Registro de Clientes');
//   })
// })

describe('Formulario Recibe inputs y reacciona correctamente', () => {
  let component;

  beforeEach(async () => {
    component = await fixture(html`
      <testing-app
      .clients=${[ ...MOCKS_USERS]}>
      </testing-app>
    `);
  });

  it('Envio de Formulario Correcto con Datos Correctos', async () => {
    await component.updateComplete;

    const inputCodigoBase = component.shadowRoot.querySelector('.card');
    console.log('🛸 input log = ', inputCodigoBase)
    const inp = inputCodigoBase.querySelector('input-number').shadowRoot.querySelector('input');
    inp.value = '005';
    inp.dispatchEvent(new Event('input'));

    const inputNombre = component.shadowRoot.querySelector('input-text[name="nombre"]').shadowRoot.querySelector('input');
    inputNombre.value = 'Carlos';
    inputNombre.dispatchEvent(new Event('input'));

    const inputApellidos = component.shadowRoot.querySelector('input-text[name="apellidos"]').shadowRoot.querySelector('input');
    inputApellidos.value = 'Ramirez';
    inputApellidos.dispatchEvent(new Event('input'));
    // Para los selectores, asegúrate de que también puedas acceder a ellos adecuadamente
    const selectTypeClient = component.shadowRoot.querySelector('select-input[name="typeClient"]').shadowRoot.querySelector('select');
    selectTypeClient.value = 'Regular';
    selectTypeClient.dispatchEvent(new Event('change'));

    const inputCorreo = component.shadowRoot.querySelector('input-text[name="correo"]').shadowRoot.querySelector('input');
    inputCorreo.value = 'mail@mail.com';
    inputCorreo.dispatchEvent(new Event('input'));

    const inputBornDate = component.shadowRoot.querySelector('input-date[name="bornDate"]').shadowRoot.querySelector('input');
    inputBornDate.value = '1990-05-20';
    inputBornDate.dispatchEvent(new Event('input'));

    const selectEstadoCivil = component.shadowRoot.querySelector('select-input[name="estadocivil"]').shadowRoot.querySelector('select');
    selectEstadoCivil.value = 'Soltero';
    selectEstadoCivil.dispatchEvent(new Event('change'));

    const checkboxAcepto = component.shadowRoot.querySelector('input-checkbox[name="acepto"]').shadowRoot.querySelector('input');
    checkboxAcepto.checked = true;
    checkboxAcepto.dispatchEvent(new Event('change'));

    // Finalmente, disparar el evento de clic en el botón de envío
    const buttonSend = component.shadowRoot.querySelector('button.send');
    buttonSend.click();

    await component.updateComplete;
    expect(component.clients).to.be.an('array').lengthOf(5);
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
        value: 'Regular',
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
        value: 'Soltero',
        valid: true
      },
      acepto: {
        value: true,
        valid: true
      }
    });
  })
})
