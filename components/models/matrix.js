
class Matrix {

    m
    constructor(martix) {
        this.m = martix
    }

    get rowsNum() {
        return this.m.length
    }

    get colsNum() {
        return this.m[0].length
    }

    each(cb) {
        for (let j = 0; j < this.colsNum; j++) {
            for (let i = 0; i < this.rowsNum; i++) {
                const element = this.m[i][j]
                cb(element,i,j)
            }
        }
    }


    transpose() {
        const desArr = []
        for (let j = 0; j < this.colsNum; j++) {
            desArr[j] = []
            for (let i = 0; i < this.rowsNum; i++) {
                desArr[j][i] = this.m[i][j]
            }
        }
        return desArr
    }

    transpose2() {
        const result = []
        for (let j = 0; j < this.colsNum; j++) {
            const temp = []
            for (let i = 0; i < this.rowsNum; i++) {
                const element = this.m[i][j]
                temp.push(element)
            }
            result.push(temp)
        }
        return result
    }


}

export {Matrix}