class OrderItem {

  constructor(orderItemRef) {

    this.orderItemRef = orderItemRef;

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.build();

    // action listener
    this.orderItemRef.on('value', snap => {

      // is deleted
      if (snap.val() == null) {

        this.element.classList.add('is-deleted');

      }

    });

  }

  build() {

    this.element.className = 'OrderItem row';
    this.element.dataset.orderItemKey = this.orderItemRef.key;

    this.element.main = this.buildMainElement();
    this.element.itemNameField = this.buildItemNameFieldElement();
    this.element.itemQuantityField = this.buildItemQuantityFieldElement();
    this.element.itemPriceField = this.buildItemPriceFieldElement();
    this.element.deleteItemButton = this.buildDeleteItemButtonElement();

    this.element.note = this.buildNoteElement();

  }

  buildMainElement() {

    const element = document.createElement('div');
    element.className = 'OrderItem-main';
    this.element.appendChild(element);

    return element;

  }

  buildItemNameFieldElement() {

    let self = this;

    const element = document.createElement('div');
    element.className = 'input-field col s5';

    element.input = document.createElement('input');
    element.input.className = 'autocomplete';
    element.input.type = 'text';
    element.input.id = this.orderItemRef.key + '-itemName';
    element.input.addEventListener('focus', event => {

      element.input.select();

    });
    setTimeout(function () {

      try {

        let instance = M.Autocomplete.init(element.input, {
          data: {
            "Marmita P": null,
            "Marmita M": null,
            "Marmita G": null,
            "Marmita F": null,
            "Porção Panqueca": null,
            "Porção Panqueca G": null,
            "Feijoada Individual": null,
            "Feijoada Grande": null,
            "Feijoada Família": null,
            "Porção Feijoada": null,
            "Coca Lata 220ml": null,
            "Coca Lata 350ml": null,
            "Fanta Lata 350ml": null,
            "Sprite Lata 350ml": null,
            "Fanta Guarana Lata 350ml": null,
            "Coca 600ml": null,
            "Coca 1 Litro": null,
            "Coca 2 Litros": null,
            "Conquista 2 Litros": null,
            "Suco Prats 330ml": null,
            "Suco DeLVale Uva": null,
            "Suco DeLVale Laranja": null
          },
          minLength: 0,
          limit: 6,
          onAutocomplete: function (select) {
            switch (select) {
              case 'Marmita P':
                self.updatePrice(8.00);
                break;
              case 'Marmita M':
                self.updatePrice(9.00);
                break;
              case 'Marmita G':
                self.updatePrice(11.00);
                break;
              case 'Marmita F':
                self.updatePrice(14.00);
                break;
              case 'Porção Panqueca':
                self.updatePrice(9.00);
                break;
              case 'Porção Panqueca G':
                self.updatePrice(12.00);
                break;
              case 'Feijoada Individual':
                self.updatePrice(15.00);
                break;
              case 'Feijoada Grande':
                self.updatePrice(20.00);
                break;
              case 'Feijoada Família':
                self.updatePrice(24.00);
                break;
              case 'Porção Feijoada':
                self.updatePrice(13.00);
                break;
              case 'Coca Lata 220ml':
                self.updatePrice(2.00);
                break;
              case 'Coca Lata 350ml':
                self.updatePrice(3.00);
                break;
              case 'Fanta Lata 350ml':
                self.updatePrice(3.00);
                break;
              case 'Sprite Lata 350ml':
                self.updatePrice(3.00);
                break;
              case 'Fanta Guarana Lata 350ml':
                self.updatePrice(3.00);
                break;
              case 'Coca 600ml':
                self.updatePrice(4.00);
                break;
              case 'Coca 1 Litro':
                self.updatePrice(5.00);
                break;
              case 'Coca 2 Litros':
                self.updatePrice(8.00);
                break;
              case 'Conquista 2 Litros':
                self.updatePrice(6.00);
                break;
              case 'Suco Prats 330ml':
                self.updatePrice(4.00);
                break;
              case 'Suco DeLVale Uva':
                self.updatePrice(3.00);
                break;
              case 'Suco DeLVale Laranja':
                self.updatePrice(3.00);
                break;
              default:
                self.updatePrice(0.00);
            }
          }
        });

      } catch (e) {

        console.log(e);

      }

    }, 500);
    element.input.addEventListener('change', () => {

      this.orderItemRef.child('itemName').set(element.input.value);

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Produto';
    this.orderItemRef.child('itemName').on('value', snap => {

      element.input.value = snap.val();

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.main.appendChild(element);

    return element;

  }

  buildItemQuantityFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s2';

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.min = 1;
    element.input.value = 1;
    element.input.id = this.orderItemRef.key + 'itemQuantity';
    element.input.addEventListener('focus', event => {
      element.input.select();
    });
    element.input.addEventListener('change', () => {

      this.orderItemRef.child('quantity').set(element.input.value);

    });
    this.orderItemRef.child('quantity').on('value', snap => {

      element.input.value = snap.val();

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Qtde';
    element.appendChild(element.label);

    this.element.main.appendChild(element);

    return element;

  }

  buildItemPriceFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s3';

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.min = 0;
    element.input.step = 1;
    element.input.value = 0.00;
    element.input.id = this.orderItemRef.key + 'itemPrice';
    element.input.addEventListener('focus', () => {
      element.input.select();
    });
    element.input.addEventListener('blur', () => this.updatePrice(element.input.value));
    element.input.addEventListener('change', () => this.updatePrice(element.input.value));
    this.orderItemRef.child('itemPrice').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Preço';
    element.appendChild(element.label);

    this.element.main.appendChild(element);

    return element;

  }

  buildDeleteItemButtonElement() {

    const element = document.createElement('div');
    element.className = 'OrderItem-actions col s2';

    element.buttonElement = document.createElement('a');
    element.buttonElement.className = 'waves-effect waves-light btn-floating btn-small red';
    element.buttonElement.innerHTML = '<i class="material-icons">remove</i>';
    element.buttonElement.addEventListener('click', () => {

      this.delete();

    });
    element.appendChild(element.buttonElement);

    this.element.main.appendChild(element);

    return element;

  }

  buildNoteElement() {

    const self = this;

    let autodestroy = false;

    const element = document.createElement('div');
    element.className = 'OrderItem-note';

    element.field = document.createElement('div');
    element.field.className = 'input-field col s10';
    element.appendChild(element.field);

    element.field.textarea = document.createElement('textarea');
    element.field.textarea.className = 'materialize-textarea';
    element.field.textarea.placeholder = 'observação';
    element.field.textarea.addEventListener('input', () => {

      this.orderItemRef.child('note').set(element.field.textarea.value.toLowerCase());

    });
    this.orderItemRef.child('note').on('value', snap => element.field.textarea.value = snap.val());
    element.field.appendChild(element.field.textarea);

    element.actionButton = document.createElement('a');
    element.actionButton.innerHTML = 'adicionar observação';
    element.actionButton.href = '#';
    element.actionButton.addEventListener('click', event => {

      event.preventDefault();

      if (element.classList.contains('is-active')) {

        element.classList.remove('is-active');
        element.actionButton.innerHTML = 'adicionar observação';

        autodestroy = true;

        // previne que a nota seja excluida acidentalmente
        setTimeout(function () {

          if (autodestroy)
            self.orderItemRef.child('note').set(null);

        }, 3000);

      } else {

        element.classList.add('is-active');
        element.actionButton.innerHTML = 'remover observação';
        element.field.textarea.focus();

        autodestroy = false;

      }

    });
    this.orderItemRef.child('note').on('value', snap => {

      if (snap.val()) {

        element.classList.add('is-active');
        element.actionButton.innerHTML = 'remover observação';

      } else {

        element.classList.remove('is-active');
        element.actionButton.innerHTML = 'adicionar observação';

      }

    });
    element.appendChild(element.actionButton);

    this.element.appendChild(element);

    return element;

  }

  updatePrice(value) {

    try {
      value = parseFloat(value).toFixed(2);
    } catch (e) {
      value = 0;
      console.log(e);
    }

    this.orderItemRef.child('itemPrice').set(value);

  }

  delete() {

    this.orderItemRef.set(null);

  }

}