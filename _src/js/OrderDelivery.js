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
            "R Ricieri Ticianelli": null,

            "Av Azarias Vieira de Rezende": "/dist/images/districts/CL.png",
            "Av Comendador L Meneghel": "/dist/images/districts/CL.png",
            "R Pref José Mario Junqueira": "/dist/images/districts/CL.png",

            "R Vereador Dino Veiga": "/dist/images/districts/LC.png",
            "R Benjamin Caetano Zambon": "/dist/images/districts/LC.png",
            "R Benedito Bernardes de Oliveira": "/dist/images/districts/LC.png",

            "Av Bandeirantes": "/dist/images/districts/NC.png",

            "R São Paulo": "/dist/images/districts/NCS.png",
            "R Prof Moacyr Castanho": "/dist/images/districts/NCS.png",
            "R Eurípides Rodrigues": "/dist/images/districts/NCS.png",
            "R Juvenal Mesquita": "/dist/images/districts/NCS.png",
            "R Frei Rafael Proner": "/dist/images/districts/NCS.png",
            "Av Edelina Meneghel Rando": "/dist/images/districts/NCS.png",

            "R João Francisco Ferreira": "/dist/images/districts/NL.png",

            "R Guilherme Sachs": "/dist/images/districts/SO.png",
            "R Teodoro Bonfante": "/dist/images/districts/SO.png",

            // C
            "Av Benedito Leite de Negreiros": "/dist/images/districts/C.png",
            "R Artur Emílio Leopoldo Conter": "/dist/images/districts/C.png",

            // L
            "R Manoel Nascimento Trindade": "/dist/images/districts/LPROMO.png",
            "R Ciriaco Russo": "/dist/images/districts/LPROMO.png",
            "R Francisco Presbítero Nogueira": "/dist/images/districts/LPROMO.png",
            "Av Tiradentes": "/dist/images/districts/LPROMO.png",
            "R Fibolito": "/dist/images/districts/LPROMO.png",
            "R José de Oliveira": "/dist/images/districts/LPROMO.png",
            "R Dr Yves Ribeiro": "/dist/images/districts/LPROMO.png",
            "R Maria Ligia Ribeiro Conter (R Rubi)": "/dist/images/districts/LPROMO.png",
            "R Gilberto Freire": "/dist/images/districts/LPROMO.png",
            "R Shiniti Sassatani": "/dist/images/districts/LPROMO.png",
            "R Benedito José de Andrade": "/dist/images/districts/LPROMO.png",
            "R Yuzo Ochiai": "/dist/images/districts/LPROMO.png",
            "R Piracicaba": "/dist/images/districts/LPROMO.png",
            "R José Mendes Vilela": "/dist/images/districts/LPROMO.png",
            "R Joversino de Assis Teixeira": "/dist/images/districts/LPROMO.png",
            "R Vicente Inácio Filho": "/dist/images/districts/LPROMO.png",
            "R Ademar Francisco Mateus": "/dist/images/districts/L.png",
            "R Mauricio Antônio Ribeiro": "/dist/images/districts/L.png",
            "R Irma Domingas Anna Pitchuk": "/dist/images/districts/L.png",
            "R José Manoel Ramos": "/dist/images/districts/L.png",

            // N
            "R Estevan Leite de Negreiros": "/dist/images/districts/N.png",
            "R Carmelo Comegno": "/dist/images/districts/N.png",
            "R Roberto Von Der Osten": "/dist/images/districts/N.png",
            "R Salvador Chianca": "/dist/images/districts/N.png",
            "Av Francisco Alves Pereira": "/dist/images/districts/N.png",
            "R Osvaldo Barbosa": "/dist/images/districts/N.png",
            "R Sebastião Jacinto da Silva": "/dist/images/districts/N.png",
            "R Hidekiti Hassegawa": "/dist/images/districts/N.png",
            "R Elisio Manoel dos Santos": "/dist/images/districts/N.png",
            "R Fioravante Malaghini": "/dist/images/districts/N.png",
            "R Antonio Tome": "/dist/images/districts/N.png",
            "R Francisca Alvares Morilha": "/dist/images/districts/N.png",
            "R Alberto Faria Cardoso": "/dist/images/districts/N.png",
            "R Nicolas Sanches Garrido": "/dist/images/districts/N.png",
            "R Sebastião Nogueira da Silva": "/dist/images/districts/N.png",
            "R José Altizani": "/dist/images/districts/N.png",
            "R Luis Dias": "/dist/images/districts/N.png",
            "R Salvador Martines Sanches": "/dist/images/districts/N.png",
            "R Claudio dos Santos": "/dist/images/districts/N.png",
            "R Massao Kamiama": "/dist/images/districts/N.png",
            "R Claudio dos Santos": "/dist/images/districts/N.png",
            "R Isaura Matsubara": "/dist/images/districts/N.png",
            "R Antonio Alvares Torres": "/dist/images/districts/N.png",
            "R Projetada I": "/dist/images/districts/N.png",

            // O
            "R Antonio Rossi": "/dist/images/districts/O.png",
            "R Nair Galvao Cioff": "/dist/images/districts/O.png",
            "R João Vilar Garcia": "/dist/images/districts/O.png",
            "Colegio Sesi": "/dist/images/districts/O.png",

            // S
            "R Joaquim Pereira Bueno": "/dist/images/districts/S.png",
            "R dos Expedicionários": "/dist/images/districts/S.png",
            "R Pastor João José": "/dist/images/districts/S.png",
            "R Sebastião Faria": "/dist/images/districts/S.png",
            "R Pref Rafael Antonaci": "/dist/images/districts/S.png",
            "R Emilio Luciano": "/dist/images/districts/S.png",
            "R Wantuil Goularte Barbosa": "/dist/images/districts/S.png",
            "R Antonio Candido Zulmires de Campos": "/dist/images/districts/S.png",


            "Av João da Silva Cravo": "/dist/images/districts/S.png",
            "Av das Torres": "/dist/images/districts/S.png",
            "": null,
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
    element.label.innerHTML = 'Rua';
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
    element.label.innerHTML = 'Complemento ou Referência';
    this.orderRef.child('address/addressReference').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

}
