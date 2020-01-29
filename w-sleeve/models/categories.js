import {Http} from "../utils/http";

class Categories {

    roots=[]
    subs=[]

    async getAll() {
        const data = await Http.request({
            url: `category/all`
        })
        this.roots = data.roots
        this.subs = data.subs
    }

    getRoots() {
        return this.roots
    }

    getSubs(parentId) {
        return this.subs.filter(s=>s.parent_id == parentId)
    }

    getRoot(rootId) {
        return this.roots.find(s=>s.id == rootId)
    }

}

export {Categories}