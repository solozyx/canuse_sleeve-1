

class SkuPending {

    pending = []

    constructor() {

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