class CustomerAutoCompleteItem {

  constructor(customer = {}, autocomplete) {

    this.customer = customer;
    this.autocomplete = autocomplete;

    this.element = document.createElement('li');
    this.hasFocus = false;

    this.build();

  }

  build() {

    this.element.name = document.createElement('span');
    this.element.name.className = 'name';
    this.element.name.innerHTML = this.customer.data.customerName;
    this.element.addEventListener('click', () => this.autocomplete.select(this));
    this.element.appendChild(this.element.name);

    this.element.address = document.createElement('span');
    this.element.address.className = 'address';
    this.element.address.innerHTML = CustomerAutoCompleteItem.buildAddressString(this.customer.data.defaultAddress);
    this.element.addEventListener('click', () => this.autocomplete.select(this));
    this.element.appendChild(this.element.address);

  }

  highlight(string) {

    string = string.replace(/[^\w\s]/gi, '');

    this.element.name.innerHTML = string
      ? this.customer.data.customerName.replace(new RegExp('(' + string + ')', 'ig'), '<span class=highlight>$1</span>')
      : this.customer.data.customerName;

  }

  focus() {

    this.hasFocus = true;
    this.element.classList.add('has-focus');

  }

  blur() {

    this.hasFocus = false;
    this.element.classList.remove('has-focus');

  }

  static buildAddressString(address) {

    let string = '';

    if (address) {

        string += address.street;
        string += string.length ? ', ' + address.houseNumber : address.houseNumber;
        string += string.length ? ', ' + address.neighborhood : address.neighborhood;
        string += string.length ? ', ' + address.reference : address.reference;

    }

    return string;

  }

}