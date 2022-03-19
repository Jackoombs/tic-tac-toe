const player = (name, token) => {
  return {name, token}
}

const gameControl = (() => {
  const player1 = player('', '0')
  const player2 = player('', 'X')
  let playerTurn = true

  const setPlayerName = () => {
    player1.name = document.querySelector('[id = "player1Input').value;
    player2.name = document.querySelector('[id = "player2Input').value;
  }

  const changeTurn = () => {
    playerTurn = !playerTurn
  }

  const getPlayerTurn = () => {
    if (playerTurn) return player1
    else return player2
  }

  const getPlayerName = (player) => {
    if (player === 'player1') return player1.name
    else return player2.name
  }

  const gameRound = (e) => {
    const selectedTile = e.target.getAttribute('dataset-tile-index')
    gameBoard.changeBoardElement(selectedTile, getPlayerTurn().token)
    checkWin()
    
  }
  
  const checkWin = () => {
    const currentBoard = gameBoard.getBoard()
    console.log(gameBoard.getBoard())
    const winCombinations = ['012', '036', '048','147', '246', '258', '345', '678']
    const currentPlayerToken = getPlayerTurn().token
    const tokenArray = []
    currentBoard.forEach((element, index) => {
      if (element === currentPlayerToken) tokenArray.push(index)
    });
    const tokenString = String(tokenArray.join(''))
    winCombinations.forEach(combination => {
      const splitCombination = combination.split('')
      const splitRegex = new RegExp(`^(?=.*${splitCombination[0]})(?=.*${splitCombination[1]})(?=.*${splitCombination[2]}).*$`)
      if (splitRegex.test(tokenString)) gameWin()
    });
  }
  
  const gameWin = () => {
    console.log('winner!')
    displayControl.winnerDisplay()
    displayControl.resetDisplay()
    gameBoard.resetBoard()
  }

  return {
    changeTurn,
    setPlayerName,
    getPlayerTurn,
    getPlayerName,
    gameRound,
    checkWin,
    gameWin
  }
})()

const gameBoard = (() => {

  const board = ['','','','','','','','','']

  const getBoard = () => {return board}

  const resetBoard = () => { 
    for (let i = 0; i < board.length; i++) {
      board[i] = ''
    }
  };

  const changeBoardElement = (index, token) => {
    board[index] = token
  }

  return {
    getBoard,
    resetBoard,
    changeBoardElement
  }
})();

const displayControl = (() => {
  const startBtn = document.querySelector('.startBtn')
  let turnIndicator = document.querySelector('.turnIndicator')
  const tiles = document.querySelectorAll('.tile')

  const initTiles = () => {
    tiles.forEach(tile => {
      tile.addEventListener('click', tileBackground)
      tile.addEventListener('click', gameControl.gameRound)
      tile.addEventListener('click', updateTurnIndicator)
      tile.addEventListener('click', removeTileListeners)
      tile.style.backgroundImage = null
    });
  }

  const removeTileListeners = (tile) => {
      if (tile.target) tile = tile.target
      tile.removeEventListener('click', tileBackground)
      tile.removeEventListener('click', gameControl.gameRound)
      tile.removeEventListener('click', updateTurnIndicator)
      tile.removeEventListener('click', removeTileListeners)
  }

  const toggleUI = () => {
    const hideInputs = document.querySelectorAll('.inputContainer')
    hideInputs.forEach(element => {
      element.classList.toggle('hide')
    });
    turnIndicator.classList.toggle('hide')
    turnIndicator.textContent = `It is ${gameControl.getPlayerName('player1')}'s turn`
    if (startBtn.textContent === 'START GAME') startBtn.textContent = 'RESET'
    else startBtn.textContent = 'START GAME'
  }

  const updateTurnIndicator = () => {
    gameControl.changeTurn()
    turnIndicator.textContent = `It is ${gameControl.getPlayerTurn().name}'s turn`
  }
 
  const tileBackground = (e) => {
    if (gameControl.getPlayerTurn().token === '0') e.target.style.backgroundImage = 'url(images/nought.png)';
    else e.target.style.backgroundImage = 'url(images/cross.png)';
  }

  const winnerDisplay = () => {
    turnIndicator.textContent = `Congratulations ${gameControl.getPlayerTurn().name} you are the winner!`
    startBtn.textContent = 'PLAY AGAIN?'
    tiles.forEach(tile => {
      removeTileListeners(tile)
    })
  }

  const resetDisplay = () => {
    startBtn.addEventListener('click', initTiles)   
  }

  const startBtnListeners = (() => {
    startBtn.addEventListener('click', gameControl.setPlayerName)
    startBtn.addEventListener('click', initTiles)
    startBtn.addEventListener('click', toggleUI)
  })()

  return {
    startBtnListeners,
    initTiles,
    tileBackground,
    toggleUI,
    updateTurnIndicator,
    winnerDisplay,
    removeTileListeners,
    resetDisplay
  }
})()
