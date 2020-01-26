import {SkuCode} from "./sku-code";
import {CellStatus} from "../../core/enum";
import {SkuPending} from "./sku-pending";
import {Joiner} from "../../utils/joiner";
import {Cell} from "./cell";

class Judger {

    fenceGroup
    pathDict = []
    skuPending

    constructor(fenceGroup) {
        this.fenceGroup = fenceGroup
        this._initSkuPending()
        this._initPathDict()
    }

    _initSkuPending() {
        this.skuPending = new SkuPending()
    }

    _initPathDict() {
        this.fenceGroup.spu.sku_list.forEach(s=>{
            const skuCode = new SkuCode(s.code)
            this.pathDict = this.pathDict.concat(skuCode.totalSegments)
            console.log(this.pathDict)
        })
    }

    judge(cell, x, y) {
        this._changeCurrentCellStatus(cell, x, y)
        this.fenceGroup.eachCell((cell, x, y)=>{
            const path = this._findPotentialPath(cell, x ,y)
            if (!path) {
                return
            }
            const isIn = this._isInDict(path)
            if (isIn) {
                this.fenceGroup.setCelStatusByXY(x, y, CellStatus.WAITING)
            } else {
                this.fenceGroup.setCelStatusByXY(x, y, CellStatus.FORBIDDEN)
            }
        })
    }

    _isInDict(path) {
        const isInclude = this.pathDict.includes(path)
        return isInclude
    }

    _findPotentialPath(cell, x, y) {
        const joiner = new Joiner('#')
        for (let i = 0; i< this.fenceGroup.fences.length; i++) {
            const selected = this.skuPending.findSelectedCellByX(i)
            if (x === i) {
                if (this.skuPending.isSelected(cell, x)){
                    return
                }
                //当前行
                const cellCode = this._getCellCode(cell.spec)
                joiner.join(cellCode)
            } else {
                //其他行
                if (selected) {
                    const selectedCellCode = this._getCellCode(selected.spec)
                    joiner.join(selectedCellCode)
                }
            }
        }
        return joiner.getStr()
    }

    _getCellCode(spec) {
        return spec.key_id + '-' + spec.value_id
    }

    _changeCurrentCellStatus(cell, x, y) {
        if (cell.status === CellStatus.WAITING) {
            this.fenceGroup.fences[x].cells[y].status = CellStatus.SELECTED
            this.skuPending.insertCell(cell, x)
        }
        if (cell.status === CellStatus.SELECTED) {
            this.fenceGroup.fences[x].cells[y].status = CellStatus.WAITING
            this.skuPending.removeCell(x)
        }
    }
}

export {Judger}