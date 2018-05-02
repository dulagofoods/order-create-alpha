class Customer {

  constructor(customerRef = false) {

    this.customerRef = customerRef;

    this.data = null;

    if (this.customerRef)
      this.init();

  }

  init() {

    this.customerRef.on('value', snap => this.update(snap.val()))

  }

  update(data) {

    this.data = data;

  }

}