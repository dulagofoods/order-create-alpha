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

    this.element.itemNameFieldElement = this.buildItemNameFieldElement();
    this.element.itemQuantityFieldElement = this.buildItemQuantityFieldElement();
    this.element.itemPriceFieldElement = this.buildItemPriceFieldElement();
    this.element.deleteItemButtonElement = this.buildDeleteItemButtonElement();

  }

  buildItemNameFieldElement() {

    var self = this;

    const element = document.createElement('div');
    element.className = 'input-field col s5';

    element.inputElement = document.createElement('input');
    element.inputElement.className = 'autocomplete';
    element.inputElement.type = 'text';
    element.inputElement.id = this.orderItemRef.key + '-itemName';
    element.inputElement.addEventListener('focus', event => {

      element.inputElement.select();

    });
    setTimeout(function () {

      try {

        let instance = M.Autocomplete.init(element.inputElement, {
          data: {
            "Marmita P": null,
            "Marmita M": null,
            "Marmita G": null,
            "Marmita F": null,
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
          minLength: 1,
          limit: 6,
          onAutocomplete: function(event, asf) {
            // console.log(event);
            // console.log(element);
            // console.log(self);
          }
        });

      } catch (e) {

        console.log(e);

      }

    }, 500);
    element.inputElement.addEventListener('change', () => {

      this.orderItemRef.child('itemName').set(element.inputElement.value);

    });
    this.orderItemRef.child('itemName').on('value', snap => {

      element.inputElement.value = snap.val();

    });
    element.appendChild(element.inputElement);

    element.label = document.createElement('label');
    element.label.htmlFor = element.inputElement.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Produto';
    element.appendChild(element.label);

    this.element.appendChild(element);

    return element;

  }

  buildItemQuantityFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s2';

    element.inputElement = document.createElement('input');
    element.inputElement.type = 'number';
    element.inputElement.min = 1;
    element.inputElement.value = 1;
    element.inputElement.id = this.orderItemRef.key + 'itemQuantity';
    element.inputElement.addEventListener('change', () => {

      this.orderItemRef.child('quantity').set(element.inputElement.value);

    });
    this.orderItemRef.child('quantity').on('value', snap => {

      element.inputElement.value = snap.val();

    });
    element.appendChild(element.inputElement);

    element.label = document.createElement('label');
    element.label.htmlFor = element.inputElement.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Qtde';
    element.appendChild(element.label);

    this.element.appendChild(element);

    return element;

  }

  buildItemPriceFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s3';

    element.inputElement = document.createElement('input');
    element.inputElement.type = 'number';
    element.inputElement.min = 0;
    element.inputElement.step = 1;
    element.inputElement.value = 0.00.toFixed(2);
    element.inputElement.id = this.orderItemRef.key + 'itemPrice';
    element.inputElement.addEventListener('focus', event => {
      element.inputElement.select();
    });
    element.inputElement.addEventListener('change', event => {

      try {
        element.inputElement.value = parseFloat(element.inputElement.value).toFixed(2);
      } catch (e) {
        console.log(e);
      }

      this.orderItemRef.child('itemPrice').set(element.inputElement.value);

    });
    this.orderItemRef.child('itemPrice').on('value', snap => {

      element.inputElement.value = snap.val();


    });
    element.appendChild(element.inputElement);

    element.label = document.createElement('label');
    element.label.htmlFor = element.inputElement.id;
    element.label.className = 'active';
    element.label.innerHTML = 'Preço';
    element.appendChild(element.label);

    this.element.appendChild(element);

    return element;

  }

  buildDeleteItemButtonElement() {

    const element = document.createElement('div');
    element.className = 'col s2';

    element.buttonElement = document.createElement('a');
    element.buttonElement.className = 'waves-effect waves-light btn-floating red';
    element.buttonElement.innerHTML = '<i class="material-icons">delete</i>';
    // element.buttonElement.innerHTML = '<span class="new badge red">drop</span>';
    element.buttonElement.addEventListener('click', () => {

      this.delete();

    });
    element.appendChild(element.buttonElement);

    this.element.appendChild(element);

    return element;

  }

  delete() {

    this.orderItemRef.set(null);

  }

}