class CustomerList {

  constructor(databaseRef = false) {

    this.databaseRef = databaseRef;

    this.customersRef = this.databaseRef.ref('customers');

    this.list = {};
    this.minStringLength = 2;

    if (databaseRef)
      this.init();

  }

  init() {

    this.customersRef.on('child_added', snap => this.addItem(snap.key, snap.ref));
    this.customersRef.on('child_removed', snap => this.removeItem(snap.key));

  }

  query(customerName = '', list = this.list) {

    customerName = customerName.toLowerCase();

    if (customerName.length >= this.minStringLength)
      return Object.values(list)
        .filter(customer => customer.data.customerName.toLowerCase().includes(customerName))
        .sort((a, b) => {
          if (a.data.customerName < b.data.customerName)
            return -1;
          if (a.data.customerName > b.data.customerName)
            return 1;
          return 0;
        });

    return [];

  }

  addItem(key, orderRef) {

    this.list[key] = new Customer(orderRef);

  }

  removeItem(key) {

    delete this.list[key];

  }

}