import { Button, Container, Grid, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import pregamePlaceholder from "../assets/pregamePlaceholder.png"
import cardBack from "../assets/card-back-black.png"

function App() {
  const CARD_FLIP_DELAY = 2000

  const [deck, setDeck] = useState([])
  const [revealedCards, setRevealedCards] = useState([])

  //console.log(deck)

  useEffect(() => {
    if (revealedCards.length === 2) {
      //if the revealed cards match ranks
      if (revealedCards[0][0] === revealedCards[1][0]) {
        setTimeout(() => {
          removeMatch(revealedCards[0], revealedCards[1])
          setRevealedCards([])
        }, CARD_FLIP_DELAY)
      } else {
        setTimeout(() => {
          hideCards()
          setRevealedCards([])
        }, CARD_FLIP_DELAY)
      }
    }
  }, [revealedCards])

  function removeMatch(card1, card2) {
    setDeck((prevDeck) => {
      return prevDeck.filter((card) => {
        return card.code !== card1 && card.code !== card2
      })
    })
  }

  function hideCards() {
    setDeck((prevDeck) => {
      return prevDeck.map((card) => {
        return {
          ...card,
          isRevealed: false,
        }
      })
    })
  }

  function handleNewGame() {
    getNewDeck()
    setRevealedCards([])
  }

  async function getNewDeck() {
    const deckData = await axios({
      method: "get",
      url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
      responseType: "json",
    })

    const deckID = deckData.data.deck_id

    const cardsData = await axios({
      method: "get",
      url: `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`,
      responseType: "json",
    })

    //add extra revealed property to each card
    const deck = cardsData.data.cards.map((card) => {
      return {
        ...card,
        isRevealed: false,
      }
    })

    setDeck(deck)
  }

  function handleCardClick(cardCode) {
    if (revealedCards.length < 2) {
      setDeck((prevDeck) => {
        return prevDeck.map((card) => {
          if (card.code === cardCode) {
            return {
              ...card,
              isRevealed: true,
            }
          } else {
            return card
          }
        })
      })

      setRevealedCards((prevCards) => {
        return [...prevCards, cardCode]
      })
    }
  }

  const cards = deck.map((card) => {
    return (
      <Grid item key={card.code} xs={1}>
        <img
          onClick={() => handleCardClick(card.code)}
          src={card.isRevealed ? card.image : cardBack}
          width={"100%"}
        />
      </Grid>
    )
  })

  return (
    <Container width="xs">
      <Grid container spacing={2} sx={{ marginTop: "5%" }}>
        <Grid item xs={12}>
          <Button onClick={handleNewGame} variant="outlined">
            New Game
          </Button>
        </Grid>
        <Grid
          container
          item
          xs={12}
          spacing={1.5}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {cards.length > 0 ? (
            cards
          ) : (
            <img src={pregamePlaceholder} width={"100%"}></img>
          )}
        </Grid>
        <Grid item xs={8}>
          <Typography>Current Score</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>Best Score</Typography>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
