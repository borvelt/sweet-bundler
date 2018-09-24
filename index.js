setTimeout(() => {
  import('./src/sum').then(imported => {
    console.log(imported.default(10, 20))
  })
}, 2000)
