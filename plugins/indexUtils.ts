import axios from 'axios'

const _ = require('lodash')

// /plugins/logger.ts
export class IndexUtils {
  async init(config: any) {
    let index: any = await axios.get(process.env.BASE_URL + '/' + config.index)
    index = index.data

    // docs id map
    const docs: any = {}

    // index map
    const fulltextMap: any = {}

    const aggs = config.aggs

    /// //////////

    // インデックス用のマップ
    const facets: any = {}

    // ファセット
    for (const aggField in aggs) {
      facets[aggField] = {}
    }

    // 詳細検索
    for (const option of config.advanced) {
      facets[option.key] = {}
    }

    for (const item of index) {
      const id = item.objectID

      // docs
      docs[id] = item

      // フルテキスト
      const f = item.fulltext
      if (!fulltextMap[f]) {
        fulltextMap[f] = []
      }
      fulltextMap[f].push(id)

      // インデクシングが必要なフィールドのみ
      const fields = Object.keys(facets)

      for (const field of fields) {
        const map = facets[field]
        let value = item[field]

        if (typeof value !== 'object') {
          value = [value]
        }

        for (const v of value) {
          if (!map[v]) {
            map[v] = []
          }
          map[v].push(id)
        }
      }
    }

    return { /* index, */ docs, fulltextMap, facets }
  }

  filter(
    index: any,
    docs: any,
    facets: any,
    config: any,
    sort: string,
    query: any
    // itaiji: any
  ) {
    const spl = sort.split(':')
    const sortValue = spl[0]
    // const sortOrder = spl[1]

    // const query = JSON.parse(JSON.stringify(this.$route.query))

    let q = query['main[query]'] || ''

    // const docs = this.docs
    // const index = this.index

    // console.log({ docs, index })

    let ids: any[] = []
    const freq: any = {}

    // 全文
    if (q === '') {
      ids = Object.keys(docs)
    } else {
      // 異体字対応
      const spl = q.split('')
      q = ''
      const itaiji: any = process.env.itaiji
      for (const e of spl) {
        q += itaiji[e] || e
      }

      const terms = q.split('　').join(' ').split(' ')

      for (const key in index) {
        let flg = true
        let count = 0
        for (const term of terms) {
          const c = (key.match(new RegExp(term, 'g')) || []).length
          if (c === 0) {
            flg = false
            break
          } else {
            count += c
          }
        }

        if (flg) {
          const ids_ = index[key]

          if (sortValue === '_score') {
            for (const id of ids_) {
              if (!freq[id]) {
                freq[id] = 0
              }
              freq[id] += count
            }
          }

          ids = ids.concat(ids_)
        }
      }
    }

    // ファセット
    // const facets = this.facets

    // advanced
    // クエリ毎に整理
    const advancedMap: any = {}
    for (const queryField in query) {
      if (queryField.includes('[advanced]')) {
        const facetField = queryField.split('[')[2].split(']')[0]

        if (!advancedMap[facetField]) {
          advancedMap[facetField] = {
            '+': [],
            '-': [],
          }
        }

        let values = query[queryField]
        if (typeof values === 'string') {
          values = [values]
        }

        for (const v of values) {
          let key = '+'
          let value = v
          if (v.startsWith('-')) {
            key = '-'
            value = v.substring(1)
          }
          if (!advancedMap[facetField][key].includes(value)) {
            advancedMap[facetField][key].push(value)
          }
        }
      }
    }

    // advanced options
    const options: any = {}
    const advancedOptions = config.advanced
    for (const option of advancedOptions) {
      options[option.key] = option
    }

    for (const facetField in advancedMap) {
      const obj = advancedMap[facetField]
      const plusValues = obj['+']
      const minusValues = obj['-']

      const matchFacets = facets[facetField]

      // プラス分
      if (plusValues.length > 0) {
        let plusMatchedIds: string[] = []
        for (const pValue of plusValues) {
          if (options[facetField].type === 'select') {
            plusMatchedIds = plusMatchedIds.concat(matchFacets[pValue])
          } else {
            // 部分一致
            for (const key in matchFacets) {
              if (key.includes(pValue)) {
                plusMatchedIds = plusMatchedIds.concat(matchFacets[key])
              }
            }
          }
        }
        ids = _.intersection(ids, plusMatchedIds)
      }

      // マイナス分
      if (minusValues.length > 0) {
        // 各値
        for (const mValue of minusValues) {
          let eachMinusMatchedIds: string[] = []
          for (const facetValue in matchFacets) {
            if (facetValue !== mValue) {
              eachMinusMatchedIds = eachMinusMatchedIds.concat(
                matchFacets[facetValue]
              )
            }
          }
          ids = _.intersection(ids, eachMinusMatchedIds)
        }
      }
    }

    // ファセット

    // クエリ毎に整理
    const queryMap: any = {}
    for (const queryField in query) {
      if (queryField.includes('[refinementList]')) {
        const facetField = queryField.split('[')[2].split(']')[0]

        if (!queryMap[facetField]) {
          queryMap[facetField] = {
            '+': [],
            '-': [],
          }
        }

        let values = query[queryField]
        if (typeof values === 'string') {
          values = [values]
        }

        for (const v of values) {
          let key = '+'
          let value = v
          if (v.startsWith('-')) {
            key = '-'
            value = v.substring(1)
          }
          if (!queryMap[facetField][key].includes(value)) {
            queryMap[facetField][key].push(value)
          }
        }

        /*
          const matchFacets = facets[facetField]

          for (const value of values) {
            let matchIds = []
            if (value.startsWith('-')) {
              const value_ = value.substring(1)
              for (const facetValue in matchFacets) {
                if (facetValue !== value_) {
                  matchIds = matchIds.concat(matchFacets[facetValue])
                }
              }
            } else {
              matchIds = matchFacets[value]
            }
            ids = _.intersection(ids, matchIds)
          }
          */
      }
    }

    for (const facetField in queryMap) {
      const obj = queryMap[facetField]
      const plusValues = obj['+']
      const minusValues = obj['-']

      const matchFacets = facets[facetField]
      if (!matchFacets) {
        continue
      }

      // プラス分
      if (plusValues.length > 0) {
        let plusMatchedIds: string[] = []
        for (const pValue of plusValues) {
          if (matchFacets[pValue]) {
            plusMatchedIds = plusMatchedIds.concat(matchFacets[pValue])
          }
        }
        ids = _.intersection(ids, plusMatchedIds)
      }

      // マイナス分
      if (minusValues.length > 0) {
        // 各値
        for (const mValue of minusValues) {
          let eachMinusMatchedIds: string[] = []
          for (const facetValue in matchFacets) {
            if (facetValue !== mValue) {
              eachMinusMatchedIds = eachMinusMatchedIds.concat(
                matchFacets[facetValue]
              )
            }
          }
          ids = _.intersection(ids, eachMinusMatchedIds)
        }
      }
    }

    return { ids, freq }
  }

  sort(
    ids: string[],
    facets: any,
    sort: string,
    freq: any,
    query: any,
    config: any
  ) {
    const q = query['main[query]'] || ''

    const spl = sort.split(':')
    const sortValue = spl[0]
    const sortOrder = spl[1]

    // ヒット数でソート
    if (sortValue === '_score' && q !== '' && Object.keys(freq).length > 0) {
      const arr = Object.keys(freq).map((e) => ({ key: e, value: freq[e] }))

      let x = 1
      let y = -1

      if (sortOrder === 'asc') {
        x = -1
        y = 1
      }

      arr.sort(function (a, b) {
        if (a.value < b.value) return x
        if (a.value > b.value) return y
        return 0
      })

      const ids_ = []
      for (const obj of arr) {
        if (ids.includes(obj.key)) {
          ids_.push(obj.key)
        }
      }

      ids = ids_ // ids.sort()
    } else if (facets[sortValue]) {
      // 項目でソート
      const sortObj = facets[sortValue]

      let keys: any = Object.keys(sortObj)

      // 数字の場合
      if (config.aggs[sortValue].type === 'number') {
        const numberedKeys = []
        for (const key of keys) {
          numberedKeys.push(Number(key))
        }
        keys = numberedKeys
      }

      // 速度の問題で、キーの数が多すぎる場合には、idsでソートする：現状、無効化
      if (keys.length === 0) {
        // keys.length > 100 && false
        ids = ids.sort()
      } else {
        if (sortOrder === 'desc') {
          // keys.reverse()
          keys.sort(function (a: any, b: any) {
            if (a > b) return -1
            if (a < b) return 1
            return 0
          })
        } else {
          // keys.sort()
          keys.sort(function (a: any, b: any) {
            if (a < b) return -1
            if (a > b) return 1
            return 0
          })
        }

        let sortIds: string[] = []
        for (const key of keys) {
          const ids_ = sortObj[key]
          // ids_ = _.intersection(ids, ids_)
          sortIds = sortIds.concat(ids_)
        }

        ids = _.intersection(sortIds, ids)
      }

      // console.log("end")
    } else {
      ids = ids.sort()
    }

    return ids
  }

  getAggs(docs: any, ids: string[], config: any) {
    const aggsConfig = JSON.parse(JSON.stringify(config.aggs)) // this.aggsConfig
    const aggs = aggsConfig // this.aggs // process.env.aggs

    /*
    // 翻訳
    for (const aggField in aggs) {
      aggs[aggField].label = aggs[aggField].label // this.$t()
    }
    */

    // const docs = this.docs

    // const ids = this.ids
    for (const id of ids) {
      const item = docs[id]

      for (const aggField in aggs) {
        const aggMap = aggs[aggField].value

        let values = item[aggField]

        // console.log({ values })
        // console.log(typeof values)

        if (typeof values === 'string') {
          values = [values]
        } else if (typeof values === 'number') {
          values = [values]
        }

        if (!values) {
          continue
        }

        for (const value of values) {
          if (!aggMap[value]) {
            aggMap[value] = 0
          }
          aggMap[value] += 1
        }
      }
    }

    for (const aggField in aggs) {
      const aggMap = aggs[aggField]

      const pairs = Object.entries(aggMap.value)

      if (aggMap.sort !== 'name:asc') {
        pairs.sort(function (p1, p2) {
          const p1Val: any = p1[1]
          const p2Val: any = p2[1]
          return -(p1Val - p2Val)
        })
      }

      const aggList = pairs // pairs.slice(0, 50) // Object.fromEntries(pairs);
      aggs[aggField].value = aggList
    }

    return aggs
  }

  initQueryProcess(data: any) {
    console.log({ data })
  }
}

export default (_: any, inject: any) => {
  inject('indexUtils', new IndexUtils())
}
