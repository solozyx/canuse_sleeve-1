import {Cell} from "./cell";
import {Joiner} from "../../utils/joiner";


class SkuPending {

    pending = []
    size

    constructor(size) {
        this.size = size
    }

    init(sku) {
        for (let i=0; i< sku.specs.length; i++) {
            const s = sku.specs[i]
            const cell = new Cell(s)
            this.insertCell(cell, i)
        }
    }

    isIntact() {
        for (let i=0; i< this.size; i++){
            if (this._isEmptyPart(i)) {
                return false
            }
        }
        return true
    }

    getSkuCode() {
        const joiner = new Joiner('#')
        this.pending.forEach(cell=>{
            const cellCode = cell.getCellCode()
            joiner.join(cellCode)
        })
        return joiner.getStr()
    }

    getCurrentSpecValues() {
        const values = this.pending.map(cell=>{
            return cell?cell.spec.value:null
        })
        return values
    }

    getMissingSpecIndex() {
        const keysIndex = []
        for (let i =0; i< this.size; i++) {
            if (!this.pending[i]) {
                keysIndex.push(i)
            }
        }
        return keysIndex
    }

    _isEmptyPart(index) {
        return this.pending[index]?false:true
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