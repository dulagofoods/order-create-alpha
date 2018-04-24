class TagList {

  constructor(orderRef = false) {

    this.orderRef = orderRef;

    this.element = document.createElement('ul');
    this.updateInterval = false;

    if (this.orderRef)
      this.init();

  }

  init() {

    const self = this;

    this.build();
    this.orderRef.on('value', snap => {

      this.update(snap.val())

      if (this.updateInterval)
        clearInterval(this.updateInterval);

      this.updateInterval = setInterval(() => snap.ref.once('value', snap => self.update(snap.val())), 30000);

    });

  }

  build() {

    this.element.className = 'TagList';
    this.element.dataset.orderRefKey = this.orderRef.key;

  }

  update(data) {

    while (this.element.firstChild)
      this.element.removeChild(this.element.firstChild);

    this.element.classList.remove('is-empty');

    if (data) {

      const list = TagList.compile(data);
      let addEmptyClass = true;

      list.forEach(tag => {
        if (tag) {

          if (Array.isArray(tag))
            tag.forEach(tag => this.element.appendChild(tag.element));
          else
            this.element.appendChild(tag.element);

          addEmptyClass = false;

        }
      });

      if (addEmptyClass)
        this.element.classList.add('is-empty');

    }

  }

  static compile(data) {

    const list = [];

    list.push(TagList.compileDeliveryTime(data.deliveryTime, data.isArchived));
    list.push(TagList.compileDelivery(data.delivery));
    list.push(TagList.compileBilling(data.billing));
    list.push(TagList.compileAddress(data.address, data.delivery));

    return list;

  }

  static compileDeliveryTime(deliveryTime = false, isArchived = false) {

    if (deliveryTime) {

      let optionalClass = ['border-green', 'green', 'font-white'];
      let diff = moment(deliveryTime.time, 'HH:mm').diff(moment());

      if (!isArchived) {
        if (diff < 1)
          optionalClass = ['border-orange', 'orange', 'font-white'];
        if (diff < -600000)
          optionalClass = ['border-red', 'red', 'font-white'];
        if (diff < -1200000)
          optionalClass = ['border-red', 'red', 'font-white', 'pulse'];
      }

      return new Tag(deliveryTime.time, optionalClass);

    }

    return false;

  }

  static compileDelivery(delivery = false) {

    if (!delivery)
      return new Tag('AQUI', ['border-green', 'green', 'font-white']);

    return false;

  }

  static compileBilling(billing = {}) {

    let list = [];

    if (billing.payments)
      Object.values(billing.payments).forEach(payment => {
        switch (payment.method) {
          case 'card':
            list.push(new Tag('cartão', ['border-green', 'font-green']));
            break;
          case 'gift':
            list.push(new Tag('cortesia', ['border-green', 'font-green']));
            break;
          case 'paid':
            list.push(new Tag('pago', ['border-green', 'font-green']));
            break;
          case 'money':
            if (parseFloat(payment.paidValue) > parseFloat(payment.referenceValue)) list.push(new Tag('troco', ['border-green', 'font-green']));
            break;
        }
      });

    return list.length ? list : false;

  }

  static compileAddress(address = {}, delivery = false) {

    if (address.neighborhood && delivery) {

      const neighborhood = address.neighborhood.toLowerCase();

      if (neighborhood.includes('centro'))
        return new Tag('Centro', ['flat', 'transparent', 'font-green']);
      else if (neighborhood.includes('leste'))
        return new Tag('Leste', ['flat', 'transparent', 'font-green']);
      else if (neighborhood.includes('norte'))
        return new Tag('Norte', ['flat', 'transparent', 'font-green']);
      else if (neighborhood.includes('oeste'))
        return new Tag('Oeste', ['flat', 'transparent', 'font-green']);
      else if (neighborhood.includes('sul'))
        return new Tag('Sul', ['flat', 'transparent', 'font-green']);

    }

  }

}
