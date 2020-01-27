// components/realm/index.js
import {FenceGroup} from "../models/fence-group";
import {Judger} from "../models/judger";
import {Spu} from "../../models/spu";
import {Cell} from "../models/cell";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        spu: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        judger: Judger,
        previewImg: String,
        discountPrice: String,
        price: String,
        stock: String,
        noSpec: Boolean,
        skuIntact: Boolean
    },

    observers: {
        'spu': function (spu) {
            if (!spu) {
                return
            }
            if (Spu.isNoSpec(spu)) {
                this.processNoSpec(spu)
                return
            }
            this.processHasSpec(spu)
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

        processNoSpec(spu) {
          this.setData({
            noSpec: true,
            skuIntact: false
          })
          this.bindSkuData(spu.sku_list[0])
          return;
        },

        processHasSpec(spu) {
          const fencesGroup = new FenceGroup(spu)
          fencesGroup.initFences1()
          this.data.judger = new Judger(fencesGroup)

          const defaultSku = fencesGroup.getDefaultSku()
          if (defaultSku) {
            this.bindSkuData(defaultSku)
          } else {
            this.bindSpuData()
          }
          this.bindTipData()
          this.bindFenceGroupData(fencesGroup)
        },

        bindSpuData() {
            const spu = this.properties.spu
            this.setData({
                previewImg: spu.img,
                title: spu.title,
                price: spu.price,
                discountPrice: spu.discount_price
            })
        },
        bindSkuData(sku) {
            this.setData({
                previewImg: sku.img,
                title: sku.title,
                price: sku.price,
                discountPirce: sku.discount_price,
                stock: sku.stock
            })
        },

        bindTipData(){
          this.setData({
              skuIntact: this.data.judger.isSkuIntact(),
              currentValues: this.data.judger.getCurrentValues(),
              missingKeys: this.data.judger.getMissingKeys()
          })
        },

        bindFenceGroupData(fenceGroup) {
            this.setData({
                fences: fenceGroup.fences
            })
        },
        onCellTap(event) {
            const data = event.detail.cell
            const cell = new Cell(data.spec)
            cell.status = data.status

            const x = event.detail.x
            const y = event.detail.y
            const judger = this.data.judger
            judger.judge(cell, x, y)
            const isSkuIntact = judger.isSkuIntact()
            if(isSkuIntact) {
              const currentSku = judger.getDeterminateSku()
              this.bindSkuData(currentSku)
            }
            this.bindTipData()
            this.bindFenceGroupData(judger.fenceGroup)
        }
    }
})
