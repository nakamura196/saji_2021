<template>
  <div></div>
</template>

<script>
export default {
  layout: 'blank',
  fetch({ base, redirect, query }) {
    console.log({ query })
    const param = query.p
    if (param === undefined) {
      return redirect('/')
    }
    let redirectPath = '/' + param.replace(base, '')

    for (const key in query) {
      if (key !== 'p') {
        redirectPath += '&' + key + '=' + query[key]
      }
    }
    return redirect(redirectPath)
  },
}
</script>
