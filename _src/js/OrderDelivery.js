class OrderDelivery {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.build();

  }

  build() {

    this.element.className = 'OrderDelivery row';

    this.element.action = this.buildActionElement();

    this.element.address = this.buildAddressFormElement();
    this.element.address.street = this.streetElement();
    this.element.address.houseNumber = this.buildHouseNumberElement();
    this.element.address.neighborhood = this.buildNeighborhoodElement();
    this.element.address.addressReference = this.buildAddressReferenceElement();

  }

  buildActionElement() {

    let element = document.createElement('div');
    element.className = 'OrderDelivery-action switch col s12';

    element.label = document.createElement('label');
    element.appendChild(element.label);

    element.label.textOff = document.createTextNode('retirada');
    element.label.appendChild(element.label.textOff);

    element.input = document.createElement('input');
    element.input.type = 'checkbox';
    element.input.addEventListener('change', event => {

      this.orderRef.child('delivery').set(element.input.checked);

    });
    this.orderRef.child('delivery').on('value', snap => {

      element.input.checked = !!snap.val();

      if (!!snap.val())
        this.element.classList.add('is-active');
      else
        this.element.classList.remove('is-active');

    });
    element.label.appendChild(element.input);

    element.label.lever = document.createElement('span');
    element.label.lever.className = 'lever';
    element.label.appendChild(element.label.lever);

    element.label.textOn = document.createTextNode('entrega');
    element.label.appendChild(element.label.textOn);

    this.element.appendChild(element);

    return element;

  }

  buildAddressFormElement() {

    let element = document.createElement('div');
    element.className = 'OrderDelivery-addressForm row';

    this.element.appendChild(element);

    return element;

  }

  streetElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s9';
    this.element.address.appendChild(element);

    element.input = document.createElement('input');
    element.input.className = 'autocomplete';
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-addressStreet';
    element.input.addEventListener('focus', event => {

      element.input.select();

    });
    setTimeout(function () {

      try {

        let instance = M.Autocomplete.init(element.input, {
          data: {
            "R Benjamin Caetano Zambon": null,
            "R Pref Mário Junqueira": null,
            "Av Comendador L Meneghel": null,
            "Av Azarias Vieira de Rezende": null,
            "R José Francisco Ferreira": null,
            "R Vereador Dino Veiga": null,
            "R Manoel Nascimento Trindade": null,
            "R Cyriaco Russo": null,
            "R Francisco Presbítero Nogueira": null,
            "Av Tiradentes": null,
            "R Fibolito": null,
            "R José de Oliveira": null,
            "R Dr Yves Ribeiro": null,
            "R Maria Ligia Ribeiro Conter (R Rubi)": null,
            "R Gilberto Freire": null,
            "R Shiniti Sassatani": null,
            "R Benedito José de Andrade": null,
            "R Yuzo Ochiai": null,
            "R Piracicaba": null,
            "R José Mendes Vilela": null,
            "R Joversino de Assis Teixeira": null,
            "R Vicente Inácio Filho": null,
            "Av Edelina M Rand": null,
            "R São Paul": null,
            "R Prof Moacyr Castanho": null,
            "R Frei Rafael Prone": null,
            "R Juvenal Mesquit": null,
            "R Eurípides Rodrigue": null,
            "R Estevam Leite de Negreiros": null,
            "Av Francisco Alves Pereira": null,
            "R Carmelo Comegno": null,
            "Av Edelina de Rezende": null,
            "R Benedito Bernardes de Oliveira": null,
            "Av Bandeirantes": null,
            "Av Benedito Leite de Negreiros": null,
            "Av das Torres": null
          },
          minLength: 1,
          limit: 6
        });

      } catch (e) {

        console.log(e);

      }

    }, 500);
    this.orderRef.child('address/street').on('value', snap => element.input.value = snap.val());
    element.input.addEventListener('change', () => {

      this.orderRef.child('address/street').set(element.input.value);

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Bairro';
    this.orderRef.child('address/street').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

  }

  buildHouseNumberElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s3';

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderRef.key + '-addressHouseNumber';
    element.input.addEventListener('input', () => this.orderRef.child('address/houseNumber').set(element.input.value));
    this.orderRef.child('address/houseNumber').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Número';
    this.orderRef.child('address/houseNumber').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

  buildNeighborhoodElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s12';
    this.element.address.appendChild(element);

    element.input = document.createElement('input');
    element.input.className = 'autocomplete';
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-addressNeighborhood';
    element.input.addEventListener('focus', event => {

      element.input.select();

    });
    setTimeout(function () {

      try {

        let instance = M.Autocomplete.init(element.input, {
          data: {
            "Centro": null,
            "Vila Maria Alice (LESTE)": null,
            "Vila Maria (LESTE)": null,
            "Vila Itapeva (LESTE)": null,
            "UENP (LESTE)": null,
            "USINA (LESTE)": null,
            "Vila Rubi (LESTE)": null,
            "Condomínio MonteRey (LESTE)": null,
            "IBC (NORTE)": null,
            "Vila Paraiso (NORTE)": null,
            "Vila Macedo (IBC) (NORTE)": null,
            "Vila Santa Terezinha (IBC) (NORTE)": null,
            "Vila Paraiso (IBC) (NORTE)": null,
            "Jardim HP (NORTE)": null,
            "Conj São Rafael (NORTE)": null,
            "Conj Mario Sérgio (NORTE)": null,
            "Conj Morar Melhor (NORTE)": null,
            "Conj Habitar Brasil (NORTE)": null,
            "Novo Paraiso (NORTE)": null,
            "Jardim Paraiso (NORTE)": null,
            "Jardim Ana Rosa (NORTE)": null,
            "Recanto dos Bandeirantes (NORTE)": null,
            "Loteamento Euri (NORTE)": null,
            "Recanto Petrópolis (NORTE)": null,
            "Vila São Pedro (CENTRO)": null,
            "Vila Lordani (SUL)": null,
            "Vila Moretti (SUL)": null,
            "Loteamento Godinho (SUL)": null,
            "Loteamento Moreti (SUL)": null,
            "Conj Ouro Verde (SUL)": null,
            "Loteamento Gamarano (SUL)": null,
            "Loteamento Barboza (SUL)": null,
            "Vila São Vicente (SUL)": null,
            "Conj Nossa S Aparecida (SUL)": null,
            "Conj Jardim Yara (SUL)": null,
            "Jardim Morumbi (SUL)": null,
            "Conj Berto Meneghel (SUL)": null,
            "Conj Pombal I (SUL)": null,
            "Conj Pombal II (SUL)": null,
            "Vila São Geraldo (SUL)": null,
            "Vila Carola (SUL)": null,
            "Conj das Torres (SUL)": null,
            "Lot Macedo (SUL)": null,
            "Vila União (OESTE)": null,
            "Jardim São Paulo (OESTE)": null,
            "Sassatani Ueno (OESTE)": null,
            "Vila Pompéia (OESTE)": null,
            "Jardim União (OESTE)": null,
            "Jardim Primavera (OESTE)": null,
            "Conj Matida (OESTE)": null,
            "Conj José Carvalho Henriques (OESTE)": null,
            "Conj Julieta Lordani (OESTE)": null,
            "Conj Celso Fontes (OESTE)": null,
            "Vila Bela Vista (OESTE)": null,
            "Jardim Belle Ville (OESTE)": null,
            "RURAL": null
          },
          minLength: 1,
          limit: 6
        });

      } catch (e) {

        console.log(e);

      }

    }, 500);
    this.orderRef.child('address/neighborhood').on('value', snap => element.input.value = snap.val());
    element.input.addEventListener('change', () => {

      this.orderRef.child('address/neighborhood').set(element.input.value);

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Bairro';
    this.orderRef.child('address/neighborhood').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    return element;

  }

  buildAddressReferenceElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s12';

    element.input = document.createElement('input');
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-addressReference';
    element.input.addEventListener('input', () => this.orderRef.child('address/addressReference').set(element.input.value));
    this.orderRef.child('address/addressReference').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Referência';
    this.orderRef.child('address/addressReference').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

}