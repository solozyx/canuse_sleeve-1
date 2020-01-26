import {Matrix} from "./matrix";
import {Fence} from "./fence";

class FenceGroup {

    spu
    skuList=[]
    fences = []

    constructor(spu) {
        this.spu = spu
        this.skuList = spu.sku_list
    }

    getDefaultSku() {
        const defaultSkuId = this.spu.default_sku_id
        if (!defaultSkuId) {
            return
        }
        return this.skuList.find(s=>s.id === defaultSkuId)
    }

    setCellStatusById(cellId, status) {
        this.eachCell((cell, x, y)=>{
            if (cell.id === cellId) {
                cell.status = status
            }
        })
    }

    setCellStatusByXY(x, y, status) {
        this.fences[x].cells[y].status = status
    }

    initFences() {
        const matrix = this._createMatrix(this.skuList)
        const fences = []
        let currentJ = -1;
        matrix.forEach((element,i,j)=>{
            if (currentJ != j) {
                currentJ = j
                fences[j] = this._createFence()
            }
            fences[j].pushValueTitle(element.value)
        })
    }

    initFences1() {
        const matrix = this._createMatrix(this.skuList)
        const revMatrix = matrix.transpose()
        const fences = []
        revMatrix.forEach(r=>{
            const fence = new Fence(r)
            fence.init()
            fences.push(fence)
        })
        this.fences = fences
    }

    _createFence() {
        const fence = new Fence()
        return fence
    }

    eachCell(cb) {
        for (let i = 0; i< this.fences.length; i ++) {
            for (let j = 0; j< this.fences[i].cells.length; j++) {
                const cell = this.fences[i].cells[j]
                cb(cell, i, j)
            }
        }
    }

    setCelStatusByXY(x, y, status) {
        this.fences[x].cells[y].status = status
    }

    _createMatrix(skuList) {
        const m = []
        skuList.forEach(sku=>{
            m.push(sku.specs)
        })
        return new Matrix(m)
    }
}

export {FenceGroup}