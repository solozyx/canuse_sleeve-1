import {Cell} from "./cell";


class SkuPending {

    pending = []

    constructor() {

    }

    init(sku) {
        for (let i=0; i< sku.specs.length; i++) {
            const s = sku.specs[i]
            const cell = new Cell(s)
            this.insertCell(cell, i)
        }
    }

    insertCell(cell, x) {
        this.pending[x] = cell
    }

    removeCell(x) {
        this.pending[x] = null
    }

    findSelectedCellByX(x) {
        return this.pending[x]
    }

    isSelected(cell, x) {
        const pendingcell = this.pending[x]
        if (!pendingcell) {
            return false
        }
        return pendingcell.id === cell.id
    }
}

export {
    SkuPending
}