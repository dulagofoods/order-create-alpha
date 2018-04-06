class Grid {

  constructor(element) {

    this.element = element;

    this.itemList = [];

    // id manager
    this.itemCount = 0;

    this.defaultColumnsNumber = 3;
    this.defaultItemWidth = 240;
    this.defaultMarginSize = 16;

    this.currentMatrixView = [[]];

    this.resize();

  }

  resize() {

    const width = (this.defaultItemWidth * this.defaultColumnsNumber)
      + ((this.defaultColumnsNumber + 1) * this.defaultMarginSize);
    this.element.style.width = width + 'px';

    const height = Grid.getLargestColumnHeight(this.currentMatrixView)
      + ((this.currentMatrixView[0].length + 1) * this.defaultMarginSize);
    this.element.style.height = height + 'px';

  }

  addItem() {

    const item = new GridItem(this, this.itemCount++, true);

    this.element.appendChild(item.element);
    this.paymentList.push(item);

    console.clear();
    console.log('Items criados: ' + this.paymentList.length);
    console.log(Grid.getItemPosition(this.paymentList.length - 1, this.defaultColumnsNumber));

    this.reOderView();

  }

  reOderView() {

    this.updateCurrentMatrixView();

    for (let column = 0; column < this.currentMatrixView.length; column++) {

      for (let row = 0; row < this.currentMatrixView[column].length; row++) {

        const item = this.currentMatrixView[column][row];

        if (item) {

          let translateX = this.getTranslateX(column);
          let translateY = this.getTranslateY(column, row);

          item.resize(this.defaultItemWidth, 0);
          item.translate(translateX, translateY);

        }

      }

    }

    this.resize();

  }

  updateCurrentMatrixView() {

    console.log(this.paymentList);
    let itemList = this.paymentList.slice().reverse();
    this.currentMatrixView = Grid.getMatrixView(paymentList, this.defaultColumnsNumber);
    console.log(this.currentMatrixView);

  }

  getTranslateY(column, row) {

    let translate = 0;

    let count = 0;

    this.currentMatrixView[column].forEach(item => {

      if (count < row)
        if (item)
          translate += item.element.offsetHeight;

      count++;

    });

    if (row > 0)
      translate += row * this.defaultMarginSize;

    return translate;

  }

  getTranslateX(column) {

    let translate = this.defaultItemWidth * column;

    if (column > 0)
      translate += column * this.defaultMarginSize;

    return translate;

  }

  static getLargestColumnHeight(matrixView) {

    let largestColumnIndex = false;
    let largestColumnHeight = false;

    for (let col = 0; col < matrixView.length; col++) {

      let column = matrixView[col];
      let columnHeight = 0;

      column.forEach(item => {

        if (item)
          columnHeight += item.element.offsetHeight;

      });

      if (largestColumnHeight) {

        if (columnHeight > largestColumnHeight) {

          largestColumnIndex = col;
          largestColumnHeight = columnHeight;

        }

      } else {

        largestColumnIndex = col;
        largestColumnHeight = columnHeight;

      }

    }

    return largestColumnHeight;

  }

  static getMatrixView(itemList, columnsNumber) {

    let matrixView = [];

    // contrói a matriz
    for (let i = 0; i < columnsNumber; i++) {
      matrixView.push([]);
      for (let j = 0; j < paymentList.length / columnsNumber; j++)
        matrixView[i].push(false);
    }

    // passa por todos items e os coloca na melhor posiçao
    for (let i = 0; i < paymentList.length; i++) {

      const row = Grid.getRowPosition(i, columnsNumber);
      matrixView[Grid.getSmallestColumn(matrixView, row)][row] = paymentList[i];

    }

    return matrixView;

  }

  static getSmallestColumn(matrixView, row) {

    let smallestColumnIndex = 0;
    let smallestColumnHeight = 0;

    for (let col = 0; col < matrixView.length; col++) {

      if (row > 0) {

        let columnHeight = 0;

        matrixView[col].forEach(item => {
          if (item)
            columnHeight += item.element.offsetHeight;
        });

        if (columnHeight < smallestColumnHeight || smallestColumnHeight === 0) {
          smallestColumnHeight = columnHeight;
          smallestColumnIndex = col;
        }

      } else if (!matrixView[col][row]) {

        smallestColumnIndex = col;
        break;

      }

    }

    return smallestColumnIndex;

  }

  static getItemPosition(i, columnsNumber) {

    return {
      column: Grid.getColumnPosition(i, columnsNumber),
      row: Grid.getRowPosition(i, columnsNumber)
    }

  }

  // item column
  static getColumnPosition(i, columnsNumber) {

    return parseInt((i - (Grid.getRowPosition(i, columnsNumber) * columnsNumber)).toString(), 10);

  }

  // item row
  static getRowPosition(i, columnsNumber) {

    return parseInt(Math.abs(i / columnsNumber).toString(), 10);

  }

}
class GridItem {

  constructor(parentGrid, id, buildElement) {

    this.parentGrid = parentGrid;

    if (buildElement)
      this.build(id);

  }

  build() {

    this.element = document.createElement('div');
    this.element.className = 'Item';
    this.element.dataset.id = this.id;

    this.element.inner = document.createElement('div');
    this.element.inner.className = 'Item-inner';
    this.element.inner.innerHTML = this.id;
    this.element.appendChild(this.element.inner);

  }

  resize(width, height) {

    this.element.style.width = width + 'px';

  }

  translate(tx, ty) {

    tx = tx + 'px';
    ty = ty + 'px';

    this.element.style.transform = 'translate3d(' + tx + ', ' + ty + ',0)';

  }

}
class Order {

  constructor(orderRef, socket, autoInit) {

    this.orderRef = orderRef;
    this.orderKey = this.orderRef.key;

    this.socket = socket || false;

    this.element = document.createElement('div');

    if (autoInit)
      this.init();

  }

  init() {

    this.consumer = new OrderConsumer(this.orderRef);
    this.items = new OrderItemList(this.orderRef);
    this.billing = new OrderBilling(this.orderRef);
    this.delivery = new OrderDelivery(this.orderRef);

    this.build();

    // action listener
    this.orderRef.on('value', snap => {

      // is deleted
      if (snap.val() == null) {

        this.element.classList.add('is-deleted');

      }

    });

  }

  build() {

    this.element.className = 'Order card grey lighten-5';
    this.element.dataset.orderRefKey = this.orderKey;

    this.element.contentElement = document.createElement('div');
    this.element.contentElement.className = 'Order-inner card-content';
    this.element.appendChild(this.element.contentElement);

    this.element.contentElement.appendChild(this.consumer.element);
    this.element.contentElement.appendChild(this.items.element);
    this.element.contentElement.appendChild(this.billing.element);
    this.element.contentElement.appendChild(this.delivery.element);

    this.buildActionsElement();

  }

  buildActionsElement() {

    this.element.actionsElement = document.createElement('div');
    this.element.actionsElement.className = 'Order-inner card-action';
    this.element.appendChild(this.element.actionsElement);

    this.element.printOrderButtonElement = document.createElement('button');
    this.element.printOrderButtonElement.className = 'waves-effect waves-light-blue btn light-blue';
    this.element.printOrderButtonElement.innerHTML = '<i class="material-icons left">print</i>Imprimir';
    this.element.printOrderButtonElement.addEventListener('click', () => {

      Order.print(this.orderRef, this.socket);

    });
    this.element.actionsElement.appendChild(this.element.printOrderButtonElement);

    this.element.deleteOrderButtonElement = document.createElement('button');
    this.element.deleteOrderButtonElement.className = 'waves-effect waves-red btn-flat';
    this.element.deleteOrderButtonElement.innerHTML = '<i class="material-icons left">delete</i>Excluir';
    this.element.deleteOrderButtonElement.addEventListener('click', () => {

      if (window.confirm('Tem certeza?')) {

        this.delete();

        try {

          M.toast({
            html: 'Pedido Excluido!'
          });

        } catch (e) {

          console.log('materialize error');

        }

      }

    });
    this.element.actionsElement.appendChild(this.element.deleteOrderButtonElement);

  }

  focus() {

    this.consumer.focus();

  }

  delete() {

    this.orderRef.set(null);

  }

  static print(orderRef, socket) {

    if (socket) {

      orderRef.once('value', snap => {

        console.log('enviando dados para impressao via socket...');
        socket.emit('print order', snap.val());

      });

    }

  }

  static create(ordersRef) {

    let createdTime = moment().toISOString();

    const orderRef = ordersRef.push({
      createdTime: createdTime,
      delivery: false
    }).ref;
    orderRef.child('items').push({
      itemPrice: 0.00,
      quantity: 1
    });

    return orderRef;

  }

}
class OrderApp {

  constructor(element, ordersRef, socket) {

    this.element = element;
    this.ordersRef = ordersRef;
    this.socket = socket;

    this.activeOrderElement = false;
    this.activeOrderKey = false;

    this.init();

  }

  init() {

    this.build();

    // this.ordersGrid = new Grid(this.element.ordersGrid);

    this.ordersRef.orderByChild('createdTime').on('child_added', snap => {

      this.pushOrder(snap.ref);

    });

  }

  build() {

    this.innerElement = document.createElement('div');
    this.innerElement.className = 'OrderApp-inner';
    this.element.append(this.innerElement);

    this.element.ordersGrid = document.createElement('div');
    this.element.ordersGrid.className = 'OrderApp-ordersGrid';
    this.innerElement.append(this.element.ordersGrid);

    this.actionButtons = document.createElement('div');
    this.actionButtons.className = 'OrderApp-actionButtons';
    this.innerElement.append(this.actionButtons);

    this.floatingActionButton = this.buildFloatingActionButton();
    this.actionButtons.appendChild(this.floatingActionButton);

  }

  buildFloatingActionButton() {

    const element = document.createElement('div');
    element.className = 'fixed-action-btn';

    // btn element
    element.btn = document.createElement('a');
    element.btn.className = 'waves-effect waves-light btn-floating btn-large orange light-1';
    element.appendChild(element.btn);
    // icon
    element.btn.icon = document.createElement('i');
    element.btn.icon.className = 'large material-icons';
    element.btn.icon.innerHTML = 'add';
    element.btn.append(element.btn.icon);
    element.btn.addEventListener('click', event => {
      this.createOrder();
    });

    // TODO criar items no botao flutuante principal para produtos
    // list element
    // element.list = document.createElement('ul');
    // element.appendChild(element.list);

    // fist link option
    // element.list.first = document.createElement('li');
    // element.list.first.btn = document.createElement('a');
    // element.list.first.btn.className = 'btn-floating red ';
    // element.list.first.btn.icon = document.createElement('i');
    // element.list.first.btn.icon.className = 'material-icons';
    // element.list.first.btn.icon.innerHTML = 'insert_chart';
    // element.list.first.btn.appendChild(element.list.first.btn.icon);
    // element.list.first.appendChild(element.list.first.btn);
    // element.list.appendChild(element.list.first);

    element.instance = M.FloatingActionButton.init(element);

    return element;

  }

  createOrder() {

    this.activeOrderKey = Order.create(this.ordersRef).key;

    try {

      M.toast({
        html: 'Pedido Criado!'
      });

    } catch (e) {

      console.log('materialize error');

    }

  }

  pushOrder(orderRef) {

    let self = this;

    if (orderRef) {

      let order = new Order(orderRef, this.socket);
      this.element.ordersGrid.insertBefore(order.element, this.element.ordersGrid.firstChild);
      order.init();

      if (this.activeOrderKey === orderRef.key)
        self.activeOrderElement = order.element;

      // seta o focus para o pedido
      setTimeout(function () {

        if (self.activeOrderKey === orderRef.key)
          order.focus();

      }, 1);

    }

  }

}
class OrderBilling {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.init();

  }

  init() {

    this.priceAmount = new OrderPriceAmount(this.orderRef);
    this.paymentList = new OrderPaymentList(this.orderRef);

    this.build();

  }

  build() {

    this.element.className = 'OrderBilling row';

    this.element.appendChild(this.priceAmount.element);
    this.element.appendChild(this.paymentList.element);

  }

}
class OrderConsumer {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');

    this.build();

  }

  build() {

    this.element.className = 'OrderConsumer row';

    this.element.appendChild(this.buildConsumerNameField());

  }

  buildConsumerNameField() {

    this.nameFieldElement = document.createElement('div');
    this.nameFieldElement.className = 'OrderConsumer-consumerNameField input-field col s12';

    // input
    this.nameFieldElement.inputElement = document.createElement('input');
    this.nameFieldElement.inputElement.className = 'validate';
    this.nameFieldElement.inputElement.id = this.orderRef.key + '-consumerName';
    this.nameFieldElement.inputElement.type = 'text';
    this.nameFieldElement.inputElement.addEventListener('input', () => {

      this.orderRef.child('consumerName').set(this.nameFieldElement.inputElement.value);

    });
    this.orderRef.child('consumerName').on('value', snap => {

      this.nameFieldElement.inputElement.value = snap.val();

    });
    this.nameFieldElement.appendChild(this.nameFieldElement.inputElement);

    // label
    this.nameFieldElement.labelElement = document.createElement('label');
    this.nameFieldElement.labelElement.className = 'active';
    this.nameFieldElement.labelElement.htmlFor = this.nameFieldElement.inputElement.id;
    this.nameFieldElement.labelElement.innerHTML = 'Nome';
    this.nameFieldElement.appendChild(this.nameFieldElement.labelElement);

    M.updateTextFields();

    return this.nameFieldElement;

  }

  focus() {

    this.nameFieldElement.inputElement.focus();

  }

}
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

    element.input = document.createElement('input');
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-street';
    element.input.addEventListener('input', () => this.orderRef.child('street').set(element.input.value));
    this.orderRef.child('street').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Rua';
    this.orderRef.child('street').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

  buildHouseNumberElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s3';

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderRef.key + '-addressHouseNumber';
    element.input.addEventListener('input', () => this.orderRef.child('addressHouseNumber').set(element.input.value));
    this.orderRef.child('addressHouseNumber').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Número';
    this.orderRef.child('addressHouseNumber').once('value', snap => {

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

    element.input = document.createElement('input');
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-addressNeighborhood';
    element.input.addEventListener('input', () => this.orderRef.child('addressNeighborhood').set(element.input.value));
    this.orderRef.child('addressNeighborhood').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Bairro';
    this.orderRef.child('addressNeighborhood').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

  buildAddressReferenceElement() {

    let element = document.createElement('div');
    element.className = 'input-field col s12';

    element.input = document.createElement('input');
    element.input.type = 'text';
    element.input.id = this.orderRef.key + '-addressReference';
    element.input.addEventListener('input', () => this.orderRef.child('addressReference').set(element.input.value));
    this.orderRef.child('addressReference').on('value', snap => element.input.value = snap.val());
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Referência';
    this.orderRef.child('addressReference').once('value', snap => {

      if (!!snap.val())
        element.label.className = 'active';

    });
    element.appendChild(element.label);

    this.element.address.appendChild(element);

    return element;

  }

}
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
          minLength: 0,
          limit: 6,
          onAutocomplete: function (select) {
            switch (select) {
              case 'Marmita P': {
                self.updatePrice(8.00);
              }
                break;
              case 'Marmita M': {
                self.updatePrice(9.00);
              }
                break;
              case 'Marmita G': {
                self.updatePrice(11.00);
              }
                break;
              case 'Marmita F': {
                self.updatePrice(14.00);
              }
                break;
              default: {
                console.log('hehe');
              }
            }
          }
        });

      } catch (e) {

        console.log(e);

      }

    }, 500);
    element.inputElement.addEventListener('change', () => {

      this.orderItemRef.child('itemName').set(element.inputElement.value);

    });
    element.appendChild(element.inputElement);

    element.labelElement = document.createElement('label');
    element.labelElement.htmlFor = element.inputElement.id;
    element.labelElement.innerHTML = 'Produto';
    this.orderItemRef.child('itemName').on('value', snap => {

      element.inputElement.value = snap.val();

      if (!!snap.val())
        element.labelElement.className = 'active';

    });
    element.appendChild(element.labelElement);

    this.element.main.appendChild(element);

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
    element.inputElement.addEventListener('focus', event => {
      element.inputElement.select();
    });
    element.inputElement.addEventListener('change', () => {

      this.orderItemRef.child('quantity').set(element.inputElement.value);

    });
    this.orderItemRef.child('quantity').on('value', snap => {

      element.inputElement.value = snap.val();

    });
    element.appendChild(element.inputElement);

    element.labelElement = document.createElement('label');
    element.labelElement.htmlFor = element.inputElement.id;
    element.labelElement.className = 'active';
    element.labelElement.innerHTML = 'Qtde';
    element.appendChild(element.labelElement);

    this.element.main.appendChild(element);

    return element;

  }

  buildItemPriceFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s3';

    element.inputElement = document.createElement('input');
    element.inputElement.type = 'number';
    element.inputElement.min = 0;
    element.inputElement.step = 1;
    element.inputElement.value = 0.00;
    element.inputElement.id = this.orderItemRef.key + 'itemPrice';
    element.inputElement.addEventListener('focus', () => {
      element.inputElement.select();
    });
    element.inputElement.addEventListener('blur', () => this.updatePrice(element.inputElement.value));
    element.inputElement.addEventListener('change', () => this.updatePrice(element.inputElement.value));
    this.orderItemRef.child('itemPrice').on('value', snap => element.inputElement.value = snap.val());
    element.appendChild(element.inputElement);

    element.labelElement = document.createElement('label');
    element.labelElement.htmlFor = element.inputElement.id;
    element.labelElement.className = 'active';
    element.labelElement.innerHTML = 'Preço';
    element.appendChild(element.labelElement);

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
class OrderItemList {

  constructor(orderRef) {

    this.orderRef = orderRef;

    this.element = document.createElement('div');
    this.itemList = [];

    this.init();

  }

  init() {

    this.build();

    this.orderRef.child('items').once('value', snap => {

      // if (snap.val() == null)
      //   this.addItem('Marmita P');

    });

    this.orderRef.child('items').on('child_added', snap => {

      this.pushItem(snap.ref);

    });

    this.orderRef.child('items').on('child_removed', snap => {

      this.delete(snap.ref);

    });

  }

  build() {

    this.element.className = 'OrderItemList row';

    this.buildItemListElement();

    this.buildActionsElement();

  }

  buildItemListElement() {

    this.element.itemListElement = document.createElement('div');
    this.element.itemListElement.className = 'OrderItemList-list';
    this.element.appendChild(this.element.itemListElement);

  }

  buildActionsElement() {

    this.element.actionsElement = document.createElement('div');
    this.element.actionsElement.className = 'OrderItems-actions';
    this.element.appendChild(this.element.actionsElement);

    this.element.addItemButton = document.createElement('button');
    this.element.addItemButton.className = 'waves-effect waves-light btn-small orange light-1';
    this.element.addItemButton.innerHTML = 'Adicionar Produto';
    this.element.addItemButton.addEventListener('click', () => {

      this.addItem();

    });
    this.element.actionsElement.appendChild(this.element.addItemButton);

  }

  addItem(itemName, itemPrice) {

    this.orderRef.child('items').push({
      itemName: itemName || '',
      itemPrice: itemPrice ||  0.00,
      quantity: 1
    });

    try {

      if (this.orderRef)
        M.toast({
          html: 'Item Adicionado!'
        });

    } catch (e) {

      console.log('materialize error');

    }

  }

  pushItem(orderItemRef) {

    if (orderItemRef) {

      let orderItem = new OrderItem(orderItemRef);
      this.itemList.push(orderItem);
      this.element.itemListElement.appendChild(orderItem.element);

    }

  }

  delete(orderItemRef) {

    for (let i = this.itemList.length; i--; ) {

      if (this.itemList[i].orderItemRef.key === orderItemRef.key)
        this.itemList.splice(i, 1);

    }

  }

}
class OrderPaymentItem {

  constructor(orderPaymentItemRef) {

    this.orderPaymentItemRef = orderPaymentItemRef;

    this.element = document.createElement('div');

    this.methodOptions = [
      {
        method: 'card',
        title: 'Cartão',
        icon: 'credit_card',
        disabled: false,
        selected: false
      },
      {
        method: 'money',
        title: 'Dinheiro',
        icon: 'attach_money',
        disabled: false,
        selected: true
      },
      {
        method: 'paid',
        title: 'Pago',
        icon: 'money_off',
        disabled: false,
        selected: false
      },
      {
        method: 'gift',
        title: 'Cortesia',
        icon: 'card_giftcard',
        disabled: false,
        selected: false
      }
    ];

    this.init();

  }

  init() {

    this.build();

    // action listener
    this.orderPaymentItemRef.on('value', snap => {

      // is deleted
      if (snap.val() == null) {

        this.element.classList.add('is-deleted');

      }

    });

  }

  build() {

    this.element.className = 'OrderPaymentItem row';
    this.element.dataset.orderPaymentItemRefKey = this.orderPaymentItemRef.key;

    this.element.method = this.buildMethodSelectElement();
    this.element.paidValue = this.buildPaidValueFieldElement();
    this.element.referenceValue = this.buildReferenceValueFieldElement();
    this.element.deletePayment = this.buildDeletePaymentButtonElement();

  }

  buildMethodSelectElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-method input-field col s4';
    this.element.appendChild(element);

    element.select = document.createElement('select');
    // element.select.className = 'browser-default';
    element.appendChild(element.select);

    element.select.defaultOption = document.createElement('option');
    element.select.defaultOption.value = '';
    element.select.defaultOption.disabled = true;
    element.select.defaultOption.innerHTML = 'Métodos';
    element.select.addEventListener('change', event => {

      this.orderPaymentItemRef.child('method').set(element.select[event.target.selectedIndex].value);

    });
    this.orderPaymentItemRef.child('method').on('value', snap => {

      setTimeout(() => {

        for (let i = element.select.options.length; i--;)

          if (element.select.options[i].value == snap.val()) {
            element.select.options[i].setAttribute('selected', true);
            element.select.options.selectedIndex = i;
          } else {
            element.select.options[i].removeAttribute('selected');
          }

        element.instance = M.FormSelect.init(element.select);

      }, 1);

    });
    element.select.appendChild(element.select.defaultOption);

    let hasSelected = false;

    this.methodOptions.forEach(option => {

      let optionElement = document.createElement('option');
      optionElement.value = option.method;
      optionElement.disabled = option.disabled;
      optionElement.innerHTML = option.title;

      if (option.selected) {
        optionElement.setAttribute('selected', true);
        hasSelected = true;
      }

      element.select.appendChild(optionElement);

    });

    if (!hasSelected)
      element.select.defaultOption.setAttribute('selected', true);

    element.label = document.createElement('label');
    element.label.innerHTML = 'Pagamento';
    element.appendChild(element.label);

    setTimeout(() => element.instance = M.FormSelect.init(element.select), 1);

    return element;

  }

  buildPaidValueFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-paidValue input-field col s3';
    this.element.appendChild(element);

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderPaymentItemRef.key + '-paidValueField';
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Pago';
    element.appendChild(element.label);

    return element;

  }

  buildReferenceValueFieldElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentItem-referenceValue input-field col s3';
    this.element.appendChild(element);

    element.input = document.createElement('input');
    element.input.type = 'number';
    element.input.id = this.orderPaymentItemRef.key + '-referenceValueField';
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.htmlFor = element.input.id;
    element.label.innerHTML = 'Referente';
    element.appendChild(element.label);

    return element;

  }

  buildDeletePaymentButtonElement() {

    const element = document.createElement('div');
    element.className = 'OrderItem-actions col s2';

    element.buttonElement = document.createElement('a');
    element.buttonElement.className = 'waves-effect btn-floating btn-small white';
    element.buttonElement.innerHTML = '<i class="material-icons red-text">remove</i>';
    element.buttonElement.addEventListener('click', () => {

      this.delete();

    });
    element.appendChild(element.buttonElement);

    this.element.appendChild(element);

    return element;

  }

  delete() {

    this.orderPaymentItemRef.set(null);

  }

}
class OrderPaymentList {

  constructor(orderRef) {

    this.orderRef = orderRef;
    this.orderBillingRef = this.orderRef.child('billing');

    this.element = document.createElement('div');
    this.paymentList = [];

    this.init();

  }

  init() {

    this.build();

    this.orderBillingRef.child('payments').on('child_added', snap => {

      this.pushPaymentItem(snap.ref);

    });

    this.orderBillingRef.child('payments').on('child_removed', snap => {

      this.delete(snap.ref);

    });

  }

  build() {

    this.element.className = 'OrderPaymentList row';

    this.element.paymentList = this.buildPaymentListElement();
    this.element.actions = this.buildActionsElement();

  }

  buildPaymentListElement() {

    const element = document.createElement('div');
    element.className = 'OrderItemList-list';
    this.element.appendChild(element);

    return element;

  }

  buildActionsElement() {

    const element = document.createElement('div');
    element.className = 'OrderPaymentList-actions';
    this.element.appendChild(element);

    element.addItemButton = document.createElement('button');
    element.addItemButton.className = 'waves-effect waves-light btn-small green light-1';
    element.addItemButton.innerHTML = 'Adicionar Pagamento';
    element.addItemButton.addEventListener('click', () => {

      this.addItem('money');

    });
    element.appendChild(element.addItemButton);

    return element;

  }

  addItem(method) {

    this.orderBillingRef.child('payments').push({
      method: method || '',
      paidValue: 0.00,
      referenceValue: 0.00
    });

  }

  pushPaymentItem(orderPaymentItemRef) {

    if (orderPaymentItemRef) {

      let paymentItem = new OrderPaymentItem(orderPaymentItemRef);
      this.paymentList.push(paymentItem);
      this.element.paymentList.appendChild(paymentItem.element);

    }

  }

  delete(orderPaymentItemRef) {

    for (let i = this.paymentList.length; i--; ) {

      if (this.paymentList[i].orderPaymentItemRef.key === orderPaymentItemRef.key)
        this.paymentList.splice(i, 1);

    }

  }

}
class OrderPriceAmount {

  constructor(orderRef) {

    this.orderRef = orderRef;
    this.orderBillingRef = orderRef.child('billing');

    this.element = document.createElement('div');

    this.priceList = [];
    this.priceAmount = 0.00;
    this.priceAmountUnlocked = false;

    this.init();

  }

  init() {

    this.build();

    this.orderRef.child('items').on('child_added', snap => {

      this.updatePriceAmount(snap.ref, snap.val());

    });

    this.orderRef.child('items').on('child_changed', snap => {

      this.updatePriceAmount(snap.ref, snap.val());

    });

    this.orderRef.child('items').on('child_removed', snap => {

      this.updatePriceAmount(snap.ref, null);

    });

    this.orderBillingRef.child('priceAmountUnlocked').on('value', snap => {

      this.priceAmountUnlocked = !!snap.val();

    });

  }

  build() {

    this.element.className = 'OrderPriceAmount row';

    this.inputField = this.buildInputFieldElement();
    this.switcher = this.buildSwitcherElement();

  }

  buildInputFieldElement() {

    const element = document.createElement('div');
    element.className = 'input-field col s6';

    element.input = document.createElement('input');
    element.input.id = this.orderRef.key + '-priceAmountInput';
    element.input.type = 'number';
    element.input.min = '0.00';
    element.input.step = '1';
    element.input.disabled = true;
    element.input.addEventListener('blur', event => {

      element.input.value = parseFloat(element.input.value).toFixed(2);

    });
    element.input.addEventListener('change', event => {

      element.input.value = parseFloat(element.input.value).toFixed(2);
      this.orderBillingRef.child('priceAmount').set(parseFloat(element.input.value).toFixed(2));

    });
    this.orderBillingRef.child('priceAmount').on('value', snap => {

      element.input.value = parseFloat(snap.val()).toFixed(2);

    });
    this.orderBillingRef.child('priceAmountUnlocked').on('value', snap => {

      element.input.disabled = !snap.val();

    });
    element.appendChild(element.input);

    element.label = document.createElement('label');
    element.label.className = 'active';
    element.label.innerHTML = 'Total';
    element.label.htmlFor = element.input.id;
    element.appendChild(element.label);

    this.element.appendChild(element);

    return element;

  }

  buildSwitcherElement() {

    const element = document.createElement('div');
    element.className = 'switch col s6';

    element.label = document.createElement('label');
    element.appendChild(element.label);

    element.input = document.createElement('input');
    element.input.type = 'checkbox';
    element.input.addEventListener('change', event => {

      this.orderBillingRef.child('priceAmountUnlocked').set(element.input.checked);

      if (!element.input.checked)
        this.refreshPriceAmount();

    });
    this.orderBillingRef.child('priceAmountUnlocked').on('value', snap => {

      element.input.checked = !!snap.val();

    });
    element.label.appendChild(element.input);

    element.label.span = document.createElement('span');
    element.label.span.className = 'lever';
    element.label.appendChild(element.label.span);

    element.label.text = document.createTextNode('alterar');
    element.label.appendChild(element.label.text);

    this.element.appendChild(element);

    return element;

  }

  updatePriceAmount(orderItemRef, data) {

    if (data)
      this.priceList[orderItemRef.key] = {
        itemPrice: data.itemPrice || 0,
        quantity: data.quantity || 0
      };
    else
      this.priceList[orderItemRef.key] = null;

    this.refreshPriceAmount();

  }

  refreshPriceAmount() {

    let priceAmount = 0;

    let priceListArray = Object.values(this.priceList);
    priceListArray.forEach(orderItem => {

      if (orderItem != null)
        priceAmount += orderItem.itemPrice * orderItem.quantity;

    });

    this.setPriceAmount(priceAmount);

  }

  setPriceAmount(priceAmount) {

    const self = this;

    this.priceAmount = priceAmount;

    // isso evita que seja criado novamente o objeto no firebase
    this.orderRef.once('value', snap => {

      if (snap.val() != null && !this.priceAmountUnlocked)
        setTimeout(() => self.orderBillingRef.child('priceAmount').set(self.priceAmount), 1);

    });

  }

}
class OrdersGrid extends Grid {

  constructor(element) {

    super(element);

    this.defaultColumnsNumber = 2;
    this.defaultItemWidth = 340;
    this.defaultMarginSize = 16;

    this.timer = false;

  }

  pushOrder(order) {

    let self = this;

    this.element.style.visibility = 'hidden';

    const ordersGridItem = new OrdersGridItem(order, this);
    this.element.appendChild(ordersGridItem.element);
    this.paymentList.push(ordersGridItem);

    if (this.timer)
      clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      setTimeout(function () {

        self.reOderView();
        self.element.style.visibility = 'visible';

      }, 100);
    }, 10);

  }

}
class OrdersGridItem extends GridItem {

  constructor(order, parentGrid) {

    super(parentGrid, order.orderKey, false);

    this.order = order;

    this.orderKey = order.orderKey;
    this.element = order.element;
    this.element.classList.add('OrdersGridItem');


  }

}
/*!
 * Du Lago {ProjectName} Project v0.0.0 (http://elbit.com.br/)
 * Copyright 2013-2018 Elbit Developers
 * Licensed under MIT (https://github.com/elbitdigital/base/blob/master/LICENSE)
*/
