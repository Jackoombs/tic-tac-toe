const player = (name, token, type) => {
  return {name, token, type}
}

const gameControl = (() => {
  const player1 = player('', '0', 'player')
  const player2 = player('', 'X', 'player')
  let playerTurn = true

  const setPlayerProps = () => {
    player1.name = document.querySelector('[id = "player1Input').value;
    player2.name = document.querySelector('[id = "player2Input').value;
    if (computerAI.checkComputerSelection()) player2.type = 'computer'
  }

  const changeTurn = () => {
    playerTurn = !playerTurn
  }

  const resetTurn = () => {
    playerTurn = true
  }

  const getPlayerTurn = () => {
    if (playerTurn) return player1
    else return player2
  }

  const gameRound = (e) => {
    if (e.target) e = e.target
    const selectedTile = e.getAttribute('dataset-tile-index')
    gameBoard.changeBoardElement(selectedTile, getPlayerTurn().token) 
    if (checkWin() === false && getPlayerTurn().type === 'player' && computerAI.checkComputerSelection()) computerAI.computerRound()
    else changeTurn()
  }
  
  const checkWin = () => {
    const currentBoard = gameBoard.getBoard()
    const winCombos = ['012', '036', '048','147', '246', '258', '345', '678']
    const currentPlayerToken = getPlayerTurn().token
    let isWin = false
    const tokenArray = []
    currentBoard.forEach((element, index) => {
      if (element === currentPlayerToken) tokenArray.push(index)
    });
    const tokenString = String(tokenArray.join(''))

    winCombos.forEach(combination => {
      const splitCombination = combination.split('')
      const splitRegex = new RegExp(`^(?=.*${splitCombination[0]})(?=.*${splitCombination[1]})(?=.*${splitCombination[2]}).*$`)
      if (splitRegex.test(tokenString)) {
        displayControl.winnerDisplay(true, combination)
        isWin = true
      }
    });
    if (!currentBoard.includes('') && !isWin) displayControl.winnerDisplay(false)
    return isWin
  }

  return {
    changeTurn,
    setPlayerProps,
    getPlayerTurn,
    gameRound,
    checkWin,
    resetTurn,
    player1,
    player2
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
    });
  }

  const removeTileBackground = () => {
    tiles.forEach(tile => {
      tile.style.backgroundImage = null;
      tile.style.backgroundColor = '#C2FCF7';
      tile.classList.add('shadow')
    });
  }

  const removeTileListener = (tile) => {
    tile.removeEventListener('click', gameControl.gameRound)
    tile.removeEventListener('click', tileBackground)
    tile.removeEventListener('click', updateTurnIndicator)
  }

  const toggleUI = () => {
    const toggleDisplay = document.querySelectorAll('.inputContainer, .opponent')
    toggleDisplay.forEach(element => {
      element.classList.toggle('hide')
    });
    turnIndicator.classList.toggle('hide')
    turnIndicator.textContent = `It is ${gameControl.player1.name}'s turn`
    if (computerAI.checkComputerSelection()) {
      turnIndicator.textContent = `It's ${gameControl.player1.name} VS The Computer!`
    }
    if (startBtn.textContent === 'START GAME') {
      startBtn.textContent = 'RESET'
      initTiles()
    } else {
      startBtn.textContent = 'START GAME'
      tiles.forEach(tile => {
        removeTileListener(tile)
      });
    }
  }

  const updateTurnIndicator = (e) => {
    if (e.target) e = e.target
    if (!computerAI.checkComputerSelection()) turnIndicator.textContent = `It is ${gameControl.getPlayerTurn().name}'s turn`
    removeTileListener(e)
  }
 
  const tileBackground = (e) => {
    if (e.target) e = e.target
    e.classList.remove('shadow')
    if (gameControl.getPlayerTurn().token === '0') {
      e.style.backgroundImage = 'url(images/nought.png)';
    } else e.style.backgroundImage = 'url(images/cross.png)';
  }

  const winnerDisplay = (result, combination) => {
    gameBoard.resetBoard()
    turnIndicator.textContent = `It's a tie!`

    if ((result && !computerAI.checkComputerSelection()) || (result && gameControl.getPlayerTurn().type === 'player')) {
      turnIndicator.textContent = `Congratulations ${gameControl.getPlayerTurn().name} you are the winner!`
      for (const c of combination) {
        tiles[c].style.backgroundColor = '#E0E59C' 
      }
    }
    if (result && gameControl.getPlayerTurn().type === 'computer') {
      turnIndicator.textContent = 'Sorry you lost!'
      for (const c of combination) {
        tiles[c].style.backgroundColor = '#E0E59C' 
      }
    }

    startBtn.textContent = 'PLAY AGAIN?'
    tiles.forEach(tile => {
      removeTileListener(tile)
      tile.classList.remove('shadow')
    })
  }

  const opponentBtnToggle = (() => {
    const buttons = document.querySelectorAll('.chooseOpponent')
    const player2Input = document.querySelector('[id = "player2"]')
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        if (!button.classList.contains('active')) {
          buttons.forEach(button => {
           button.classList.toggle('active')
          });
        }
      })
      if (button.getAttribute('id') === 'player') {
        button.addEventListener('click', () => {
          player2Input.classList.remove('hide2')
        })
      }
      if (button.getAttribute('id') === 'computer') {
        button.addEventListener('click', () => {
          player2Input.classList.add('hide2')
        })
      }
    });
  })()

  const startBtnListeners = (() => {
    startBtn.addEventListener('click', gameControl.setPlayerProps)
    startBtn.addEventListener('click', gameBoard.resetBoard)
    startBtn.addEventListener('click', toggleUI)
    startBtn.addEventListener('click', removeTileBackground)
    startBtn.addEventListener('click', gameControl.resetTurn)
    removeTileBackground()
  })()

  return {
    startBtnListeners,
    initTiles,
    tileBackground,
    toggleUI,
    updateTurnIndicator,
    winnerDisplay,
    removeTileListener,
    removeTileBackground,
  }
})()

const computerAI = (() => {

  const checkComputerSelection = () => {
    const activeButton = document.querySelector('.active')
    if (document.querySelector('.active').getAttribute('id') === 'computer') return true
  }

  const dumbComputerTileChoice = () => {
    const currentBoard = gameBoard.getBoard()
    const emptyTileArray = []
    currentBoard.forEach((element, index) => {
      if (element === '') emptyTileArray.push(index)
    });
    const randomIndex = Math.floor(Math.random() * emptyTileArray.length)
    return emptyTileArray[randomIndex]
  }

  const smartComputerTileChoice = () => {
    const currentBoard = gameBoard.getBoard();
    console.log(currentBoard)
    const winCombos = ['012', '036', '048','147', '246', '258', '345', '678']
    let bestMoves = []
    let chosenMove = ''
    let playerTilesArray = []
    let computerTilesArray = []
    currentBoard.forEach((tile, index) => {
      if (tile === '0') playerTilesArray.push(index)
      if (tile === 'X') computerTilesArray.push(index)
    });
    bestMoves.push(...checkForWinningMove(winCombos, computerTilesArray))
    bestMoves.push(...checkForWinningMove(winCombos, playerTilesArray))
    bestMoves.push('4')
    bestMoves.push(...['1','3','5','7'])
    bestMoves.push(...['0','2','6','8'])
    if (playerTilesArray[0] === 4 && playerTilesArray.length === 1) return 0
    for (let move of bestMoves) {
      move = Number(move)
      if (currentBoard[move] === '') {
        console.log(move)
        return move
      }
    }; 
  }

  const checkForWinningMove = (winCombos, tileArray) => {
    let winningMove = []
    winCombos.forEach(combination => {
      let inCombi = [];
      let notInCombi = [];
      [...combination].forEach(i => {
        if (tileArray.includes(Number(i))) {
          inCombi.push(i)  
        } else notInCombi.push(i)
      })
      if (inCombi.length > 1) winningMove.push(...notInCombi)
    })
    return winningMove
  };

  const computerRound = () => {
    gameControl.changeTurn()
    const computerTile = document.querySelector(`[dataset-tile-index = "${smartComputerTileChoice()}"]`)
    displayControl.tileBackground(computerTile)
    gameControl.gameRound(computerTile)
    displayControl.updateTurnIndicator(computerTile)
  }

  return {
    dumbComputerTileChoice,
    checkComputerSelection,
    computerRound,
    smartComputerTileChoice
  }
})()