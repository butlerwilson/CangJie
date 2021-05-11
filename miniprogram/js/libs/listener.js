import Main from '../main'

const startMainGame = (e) => {
  e.preventDefault()

  const x = e.touches[0].clientX
  const y = e.touches[0].clientY
  console.log(x)
  new Main()
  console.log("after new main()")
}

module.exports.listeners = {
  startMainGame: startMainGame
}
