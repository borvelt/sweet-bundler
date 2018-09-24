export default () =>
  setTimeout(() => {
    import('./sum').then(imported => {
      console.log(imported.default(10, 40))
    })
  }, 2000)
