export default class listItem {
    constructor(list_name) {
        this._name = list_name;
        this._items = [];
    }
    set new_name(new_name) {
        this._name = new_name;
    }
    get name() {
        return this._name;
    }
    addItem(item) {
        this._items.push(item);
    }
    removeItem(item) {
        if (this._items.indexOf('item') != 1) {
            this._items.splice(this._items.indexOf('item'), 1)
        }
    }
}