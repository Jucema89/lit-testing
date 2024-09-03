import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../../src/components/client-list/client-list-component';

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

describe('client-list Incializa comportamientos básicos', () => {
  let component;
  let clientDetail;

  beforeEach(async () => {
    component = await fixture(html`
     <client-list
        .clients=${[ ...MOCKS_USERS]}>
      </client-list>
    `);
    clientDetail = component.shadowRoot.querySelector('.clients');
  });

  it('Estado inicial cargado', async () => {
    await component.updateComplete;
    expect(component.clients).to.be.an('array').lengthOf(4);
    expect(component.oneClient).to.be.empty;
    //existen 4 tags <li> una por cada User del Mock
    expect(clientDetail.querySelectorAll('li')).to.have.lengthOf(4);
  })
})

describe('client-list Comunicacion de Eventos exitosa', () => {
  let component;
  let clientDetail;
  let AllUsers = [ ...MOCKS_USERS]

  function handleRemoveClient(e){
    return e.detail
  }

  function viewClients(e){
    return e.detail
  }

  beforeEach(async () => {
    component = await fixture(html`
      <client-list
        .clients=${AllUsers}
        @on-remove-client=${handleRemoveClient}
        @on-back-form=${viewClients}>
      </client-list>
    `);
    clientDetail = component.shadowRoot.querySelector('.clients');
  });

  it('Flujo de Eliminado de usuario de la lista', async () => {
    component.addEventListener('on-remove-client', async (e) => {
      AllUsers = AllUsers.filter(user => user.id !== e.detail)
      component.clients = AllUsers;
      await component.updateComplete;
      expect(component.clients).to.have.lengthOf(3);
    });
    const firstLi = clientDetail.querySelector('li');
    firstLi.querySelector('.one button').click()
  });


  it('Retorno a vista de Formulario', () => {
    component.addEventListener('on-back-form', async(e) => {
      await component.updateComplete;
      expect(e.detail).to.be.true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      //  const form = document.getElementsByTagName('form')
      // const h2 = form.getElementsByTagName('h2');
      // console.log('🛸 form ', h2)
      expect(component).to.be.null;
    });
    const btnBack = clientDetail.querySelector('.actions');
    btnBack.querySelector('button').click()
  });
})

describe('client-list Comunicacion de Eventos exitosa', () => {
  let component;
  let clientDetail;
  let AllUsers = [ ...MOCKS_USERS]

  function handleRemoveClient(e){
    return e.detail
  }

  function viewClients(e){
    return e.detail
  }

  beforeEach(async () => {
    component = await fixture(html`
      <client-list
        .clients=${AllUsers}
        @on-remove-client=${handleRemoveClient}
        @on-back-form=${viewClients}>
      </client-list>
    `);
    clientDetail = component.shadowRoot.querySelector('.clients');
  });

  it('Renderizado de Datos de Usuario Seleccionado', async () => {

    clientDetail.querySelector('li').click();
    await component.updateComplete;

    const clientSelected = clientDetail.querySelector('.card-client');
    expect(clientSelected).to.exist;
    expect(clientSelected.querySelector('h2').textContent).to.equal('Detalle del Cliente');
    expect(clientSelected.querySelector('p').textContent).to.equal('Nombre: ' + component.oneClient.nombre.value);
  })

  it('Eliminado de Datos de Usuario Seleccionado por segunda vez', async () => {
    clientDetail.querySelector('li').click();
    //await component.updateComplete;
    clientDetail.querySelector('li').click();
    await component.updateComplete;

    const clientSelected = clientDetail.querySelector('.card-client');
    expect(clientSelected).to.be.null;
    // expect(clientSelected.querySelector('h2').textContent).to.equal('Detalle del Cliente');
    // expect(clientSelected.querySelector('p').textContent).to.equal('Nombre: ' + component.oneClient.nombre.value);
  })

  it('Renderizado sin datos de Usuario seleccionado', async () => {
    clientDetail.querySelector('li').click();
    component.oneClient = {}
    await component.updateComplete;
    const clientSelected = clientDetail.querySelector('.card-client');
    expect(clientSelected).to.be.null;
  })

})

